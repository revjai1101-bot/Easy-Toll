import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { note, mode } = await req.json();

    // Use the model that works for your account
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    let systemInstruction = "";

    // --- DEFINE MODES ---
    switch (mode) {
      case "tech_support":
        systemInstruction = `You are a Senior IT Support Specialist. 
        Rewrite the user's rough notes into a professional ticket log.
        Structure:
        - **Issue Summary**: One clear sentence.
        - **Details/Observations**: Bullet points of technical details.
        - **Troubleshooting Steps**: What was done.
        - **Resolution**: The final outcome.
        Tone: Professional, concise, objective.`;
        break;

      case "email":
        systemInstruction = `You are a corporate communications expert. 
        Rewrite the rough notes into a polite, professional email.
        Include a clear Subject Line.
        Tone: Polite, professional, clear.`;
        break;

      case "meeting_minutes":
        systemInstruction = `You are a professional project manager.
        Convert the rough notes into structured Meeting Minutes.
        Structure:
        - **Meeting Objective**: One sentence summary.
        - **Key Discussion Points**: Bullet points of main topics.
        - **Action Items**: Checklist of who needs to do what.
        - **Next Steps**: When is the follow-up?`;
        break;

      case "kb_article":
        systemInstruction = `You are a Technical Writer.
        Convert the rough notes into a Knowledge Base (KB) Article for a wiki.
        Structure:
        - **Title**: Clear and descriptive.
        - **Problem Description**: What is the error/issue?
        - **Root Cause**: Why is this happening?
        - **Solution**: Step-by-step instructions to fix it.`;
        break;

      default:
        systemInstruction = "Refine this text to be professional and clear.";
    }

    const result = await model.generateContent(`${systemInstruction}\n\nUSER NOTES:\n${note}`);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ output: text });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to refine note." }, { status: 500 });
  }
}