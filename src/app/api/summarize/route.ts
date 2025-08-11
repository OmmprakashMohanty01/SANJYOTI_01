// src/app/api/summarize/route.ts
import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const systemPrompt = `You are an expert academic summarizer. Your task is to summarize the provided text. Provide the output in a clean, valid JSON format with two keys: "narrative" and "bullets". The "narrative" should be a single, concise paragraph. The "bullets" should be an array of the 3-5 most important points. Do not include any markdown formatting like \`\`\`json.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the text to summarize:\n\n---\n${text}\n---` }
      ],
      model: "llama3-8b-8192", // Fast and efficient model
      temperature: 0.3,
      response_format: { type: "json_object" }, // Enforce JSON output
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("Groq API returned an empty response.");
    }
    
    const summaryJson = JSON.parse(responseText);
    return NextResponse.json(summaryJson);

  } catch (error) {
    console.error("Error in /api/summarize:", error);
    return NextResponse.json({ error: "Failed to generate summary." }, { status: 500 });
  }
}