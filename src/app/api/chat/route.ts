// src/app/api/chat/route.ts
import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface FrontendMessage {
  role: 'user' | 'model';
  content: string | { reply: string };
}

export async function POST(req: NextRequest) {
  try {
    const { history } = await req.json();

    if (!history || !Array.isArray(history) || history.length === 0) {
      return NextResponse.json({ error: "Conversation history is required." }, { status: 400 });
    }

    const systemPrompt = `You are LinguaMentor, a friendly and encouraging language tutor. Your user is practicing English. Your task is to: 1. Respond naturally and conversationally to the user's last message. 2. Identify any grammatical or spelling mistakes in the user's LAST message ONLY. 3. Provide the output as a single, valid JSON object with three keys: "reply", "hasCorrection", and "corrections". "reply" is your conversational response. "hasCorrection" is a boolean. "corrections" is an array of objects, where each object has "original", "corrected", and "explanation" keys. If no corrections, this should be an empty array. Do not include any markdown formatting.`;
    
    const messagesForApi = history
      .slice(1) // Remove the initial greeting from the 'model'
      .map((msg: FrontendMessage) => ({
        role: msg.role === 'model' ? 'assistant' : 'user', // Groq uses 'assistant' for the model
        content: typeof msg.content === 'string' ? msg.content : msg.content.reply,
      }));

    const completion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            ...messagesForApi
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
        response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
        throw new Error("Groq API returned an empty response.");
    }

    const aiResponse = JSON.parse(responseText);
    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json({ error: "Failed to get chat response." }, { status: 500 });
  }
}