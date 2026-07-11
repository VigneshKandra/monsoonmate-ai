import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { PreparednessPlanResponse } from "@/types/planner";
import { buildPreparednessPrompt } from "@/prompts/preparednessPrompt";

function cleanJsonResponse(rawText: string): string {
  let cleaned = rawText.trim();
  
  // Remove starting markdown code fences
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  
  // Remove ending markdown code fences
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  
  return cleaned.trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userProfile } = body || {};
    
    if (!userProfile) {
      return NextResponse.json(
        { success: false, message: "Missing userProfile in request body" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Configuration Error: The GEMINI_API_KEY is missing on the server. Please check your environments.",
        },
        { status: 500 }
      );
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-3.5-flash";
    const ai = new GoogleGenAI({ apiKey });

    const prompt = buildPreparednessPrompt(userProfile);

    const timeoutDuration = 60000;
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Timeout Error: The request to Gemini API exceeded the 60-second response limit. Please try again.")),
        timeoutDuration
      )
    );

    console.log("Generating preparedness plan...");
    console.time("Gemini Request");

    const apiCallPromise = ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    });

    const response = await Promise.race([apiCallPromise, timeoutPromise]);
    
    console.timeEnd("Gemini Request");
    console.log("Gemini response received.");
    
    const text = response.text;

    console.log("========== RAW GEMINI RESPONSE ==========");
    console.log(text);
    console.log("=========================================");

    if (!text) {
      return NextResponse.json(
        { success: false, message: "Empty Response: The AI response returned empty." },
        { status: 502 }
      );
    }

    const cleanedText = cleanJsonResponse(text);

    try {
      const parsedPlan: PreparednessPlanResponse = JSON.parse(cleanedText);
      return NextResponse.json({ success: true, plan: parsedPlan });
    } catch {
      return NextResponse.json(
        { success: false, message: "Parsing Error: Received an invalid plan format from the server." },
        { status: 502 }
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, message: `Unexpected Server Error: ${message}` },
      { status: 500 }
    );
  }
}
