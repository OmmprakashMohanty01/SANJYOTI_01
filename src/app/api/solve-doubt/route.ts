// src/app/api/solve-doubt/route.ts
import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { question, context } = await req.json();
    if (!question) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    const systemPrompt = `You are the "Clarity Engine," a helpful and patient AI teaching assistant for the SanJyoti learning platform. A student has a question while on a specific page of the app. Your task is to answer the student's question clearly and concisely. Use the provided "Page Context" to understand what the student is looking at. If the question is general, answer it to the best of your ability. If the question relates to the context, tailor your answer to it. If you don't know the answer, say so honestly. Keep your answers helpful and easy to understand. Format your answer using standard markdown for readability.`;

    const userPrompt = `Page Context: "${context || 'General Dashboard'}"\n\nStudent's Question: "${question}"`;
    
    const completion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        model: "llama3-8b-8192",
        temperature: 0.5,
    });

    const answer = completion.choices[0]?.message?.content;
    if (!answer) {
        throw new Error("Groq API returned an empty response.");
    }
    
    return NextResponse.json({ answer });

  } catch (error) {
    console.error("Error in /api/solve-doubt:", error);
    return NextResponse.json({ error: "Failed to get an answer." }, { status: 500 });
  }
}