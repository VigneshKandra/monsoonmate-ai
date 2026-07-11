import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildPreparednessPrompt } from "@/prompts/preparednessPrompt";

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

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
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
    
    console.log("FULL RESPONSE OBJECT");
    console.dir(response, { depth: null });
    
    console.timeEnd("Gemini Request");
    console.log("Gemini response received.");
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseAny = response as any;
    const text =
      typeof responseAny.text === "function"
        ? responseAny.text()
        : responseAny.text;

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("RAW RESPONSE");
    console.log(text);

    let cleaned = text.trim();
    cleaned = cleaned
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("========== CLEANED RESPONSE ==========");
    console.log(cleaned);

    try {
       const parsed = JSON.parse(cleaned);
       return NextResponse.json({
          success: true,
          plan: parsed
       });
    }
    catch (error) {
       console.error("JSON PARSE FAILED", error);
       console.error(cleaned);

       return NextResponse.json({
          success: false,
          message: "JSON_PARSE_ERROR",
          raw: cleaned
       });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, message: `Unexpected Server Error: ${message}` },
      { status: 500 }
    );
  }
}
