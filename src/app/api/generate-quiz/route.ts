// src/app/api/generate-quiz/route.ts
import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || text.trim().length < 50) {
      return NextResponse.json({ error: "Please provide at least 50 characters of text." }, { status: 400 });
    }

    const systemPrompt = `You are an expert quiz creator for students. Based on the provided notes, generate a 5-question multiple-choice quiz. Provide the output as a valid JSON array of objects. Each object must have these exact keys: "question" (a string), "options" (an array of 4 unique strings), and "answer" (the correct string from the options). Do not include any markdown formatting like \`\`\`json.`;

    const completion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Here are the notes to create a quiz from:\n\n---\n${text}\n---` }
        ],
        model: "llama3-8b-8192",
        temperature: 0.5,
        response_format: { type: "json_object" },
    });
    
    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("Groq API returned an empty response.");
    }

    const quizJson = JSON.parse(responseText);
    // Groq sometimes wraps the array in a root key, so we handle that
    const questions = quizJson.questions || quizJson;

    return NextResponse.json(questions);

  } catch (error) {
    console.error("Error in /api/generate-quiz:", error);
    return NextResponse.json({ error: "Failed to generate quiz." }, { status: 500 });
  }
}