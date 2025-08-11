// src/app/api/get-recommendation/route.ts
import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import courseCatalog from '@/data/course-catalog.json';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface CompletedLesson {
  id: string;
  score: number;
}

export async function POST(req: NextRequest) {
  try {
    const { completedLessons, goal } = await req.json();

    if (!Array.isArray(completedLessons)) {
      return NextResponse.json({ error: "User progress data is required." }, { status: 400 });
    }

    const completedLessonIds = completedLessons.map((lesson: CompletedLesson) => lesson.id);
    const availableLessons = courseCatalog.filter(course => !completedLessonIds.includes(course.id));
    
    if (availableLessons.length === 0) {
        return NextResponse.json({ reason: "You've completed all available courses! Congratulations!", recommendationId: null, details: null });
    }

    const systemPrompt = `You are Pathfinder AI, an expert learning path advisor for the SanJyoti platform. Analyze a student's progress and the available lessons to recommend the single best lesson to take next. Rules: 1. Do not recommend a lesson if prerequisites are not met. 2. If the last score was low (<80), suggest a lesson of similar or easier difficulty. 3. If scores are high (>90), suggest a more challenging lesson. 4. Align with the student's goal. Return your response as a single, valid JSON object with the keys "recommendationId" (must be an ID from the available list) and "reason" (a short, encouraging explanation). Do not include any markdown.`;
    
    const userPrompt = `Student's Goal: "${goal || 'General Knowledge'}"\n\nStudent's Completed Lessons: ${JSON.stringify(completedLessons, null, 2)}\n\nAvailable Lessons to choose from: ${JSON.stringify(availableLessons, null, 2)}`;

    const completion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        model: "llama3-8b-8192",
        temperature: 0.4,
        response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;
     if (!responseText) {
        throw new Error("Groq API returned an empty response.");
    }

    const recommendation = JSON.parse(responseText);
    const recommendedCourseDetails = courseCatalog.find(course => course.id === recommendation.recommendationId);

    return NextResponse.json({ ...recommendation, details: recommendedCourseDetails });

  } catch (error) {
    console.error("Error in /api/get-recommendation:", error);
    return NextResponse.json({ error: "Failed to get recommendation." }, { status: 500 });
  }
}