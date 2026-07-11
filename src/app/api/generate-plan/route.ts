import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { PreparednessPlanResponse, EmergencyContact } from "@/types/planner";
import { buildPreparednessPrompt } from "@/prompts/preparednessPrompt";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null;
}

/**
 * Strips markdown code fences, BOM, invisible control chars, and any text
 * outside the outermost JSON braces without corrupting valid JSON.
 */
function cleanJsonResponse(rawText: string): string {
  let cleaned = rawText.trim();

  // Remove UTF-8 BOM
  if (cleaned.charCodeAt(0) === 0xfeff) {
    cleaned = cleaned.substring(1);
  }

  // Remove markdown code fences
  cleaned = cleaned.replace(/```json/g, "").replace(/```/g, "").trim();

  // Extract content between the first '{' and the last '}'
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // Remove invisible control characters (keep tabs \x09, newlines \x0A, carriage returns \x0D)
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "");

  return cleaned.trim();
}

/**
 * Attempts JSON.parse. On failure, tries lightweight auto-repair
 * (trailing commas). On second failure, re-throws with full diagnostics.
 */
function safeParseJson(rawText: string): Record<string, unknown> {
  const cleaned = cleanJsonResponse(rawText);

  // Attempt 1: direct parse
  try {
    console.log("[parse] JSON parsing start");
    const parsed = JSON.parse(cleaned);
    console.log("[parse] JSON parsing success");
    if (isRecord(parsed)) return parsed;
    throw new Error("Parsed value is not a JSON object");
  } catch (firstError) {
    console.warn("[parse] Initial parse failed, attempting auto-repair…", firstError);
  }

  // Attempt 2: remove trailing commas before ] or }
  const repaired = cleaned.replace(/,(\s*[\]}])/g, "$1");
  try {
    const parsed = JSON.parse(repaired);
    console.log("[parse] JSON parsing success after trailing-comma repair");
    if (isRecord(parsed)) return parsed;
    throw new Error("Repaired value is not a JSON object");
  } catch (secondError) {
    console.error("[parse] JSON parsing failure — all repairs exhausted");
    console.error("[parse] Cleaned text:", cleaned);
    console.error("[parse] Repaired text:", repaired);
    throw secondError;
  }
}

// ---------------------------------------------------------------------------
// Response validation & default-filling
// ---------------------------------------------------------------------------

function validateAndSanitize(raw: Record<string, unknown>): PreparednessPlanResponse {
  const str = (key: string, fallback: string): string => {
    const v = raw[key];
    return typeof v === "string" && v.trim() ? v.trim() : fallback;
  };

  const strArr = (src: unknown): string[] =>
    Array.isArray(src) ? src.filter((i): i is string => typeof i === "string") : [];

  const objField = (key: string): Record<string, unknown> => {
    const v = raw[key];
    return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  };

  // --- Strings ---
  const riskLevel = str("riskLevel", "Moderate");
  const riskSummary = str("riskSummary", "Standard monsoon risk assessment for your region.");
  const language = str("language", "English");
  const finalMessage = str("finalMessage", "Prioritize safety, stay informed of local reports, and follow civil warning procedures.");

  // --- Preparedness Plan ---
  const rawPlan = objField("preparednessPlan");
  const preparednessPlan = {
    today: strArr(rawPlan.today),
    tomorrow: strArr(rawPlan.tomorrow),
    duringRain: strArr(rawPlan.duringRain),
    afterRain: strArr(rawPlan.afterRain),
  };
  if (preparednessPlan.today.length === 0) preparednessPlan.today = ["Monitor local municipal alerts and emergency announcements."];
  if (preparednessPlan.tomorrow.length === 0) preparednessPlan.tomorrow = ["Conduct structural checks around your immediate premises."];
  if (preparednessPlan.duringRain.length === 0) preparednessPlan.duringRain = ["Stay indoors and keep electronic appliances disconnected."];
  if (preparednessPlan.afterRain.length === 0) preparednessPlan.afterRain = ["Check property structures for leakage or water stagnation."];

  // --- Simple arrays ---
  let emergencyChecklist = strArr(raw.emergencyChecklist);
  if (emergencyChecklist.length === 0) emergencyChecklist = ["Secure windows and balconies.", "Verify emergency backup power.", "Confirm transit pathways are clear."];

  let emergencyKit = strArr(raw.emergencyKit);
  if (emergencyKit.length === 0) emergencyKit = ["Dry food and sealed water", "First aid kit", "Flashlight with batteries", "Emergency power bank"];

  let communityRecommendations = strArr(raw.communityRecommendations);
  if (communityRecommendations.length === 0) communityRecommendations = ["Share emergency numbers with neighbors.", "Check drainage around property."];

  // --- Travel Advisory ---
  const rawTravel = objField("travelAdvisory");
  const travelAdvisory = {
    status: typeof rawTravel.status === "string" && rawTravel.status.trim() ? rawTravel.status.trim() : "Advisory",
    recommendation: typeof rawTravel.recommendation === "string" && rawTravel.recommendation.trim() ? rawTravel.recommendation.trim() : "Exercise caution during heavy rainfall.",
    avoid: strArr(rawTravel.avoid),
    safeOptions: strArr(rawTravel.safeOptions),
  };
  if (travelAdvisory.avoid.length === 0) travelAdvisory.avoid = ["Underpasses and waterlogged roads."];
  if (travelAdvisory.safeOptions.length === 0) travelAdvisory.safeOptions = ["Stay indoors or use municipal transit."];

  // --- Safety Tips ---
  const rawTips = objField("safetyTips");
  const safetyTips = {
    before: strArr(rawTips.before),
    during: strArr(rawTips.during),
    after: strArr(rawTips.after),
  };
  if (safetyTips.before.length === 0) safetyTips.before = ["Audit roof leaks and gutter blockages."];
  if (safetyTips.during.length === 0) safetyTips.during = ["Stay away from metal railings and waterlogged areas."];
  if (safetyTips.after.length === 0) safetyTips.after = ["Clear stagnant water to prevent mosquito breeding."];

  // --- Emergency Contacts ---
  const contacts: EmergencyContact[] = [];
  if (Array.isArray(raw.emergencyContacts)) {
    for (const c of raw.emergencyContacts) {
      if (isRecord(c) && typeof c.name === "string" && typeof c.reason === "string") {
        contacts.push({ name: c.name.trim(), reason: c.reason.trim() });
      }
    }
  }
  const emergencyContacts = contacts.length > 0
    ? contacts
    : [{ name: "National Emergency Number", reason: "Dial 112 for emergencies" }];

  return {
    riskLevel,
    riskSummary,
    preparednessPlan,
    emergencyChecklist,
    emergencyKit,
    travelAdvisory,
    safetyTips,
    communityRecommendations,
    emergencyContacts,
    language,
    finalMessage,
  };
}

// ---------------------------------------------------------------------------
// Error classifier
// ---------------------------------------------------------------------------

function classifyError(message: string): { code: string; status: number; userMessage: string } {
  if (message.includes("Timeout Error")) {
    return { code: "REQUEST_TIMEOUT", status: 504, userMessage: "Timeout Error: The safety plan generation request timed out. Please retry." };
  }
  if (message.includes("API key not valid") || message.includes("API_KEY_INVALID") || message.includes("API key expired")) {
    return { code: "API_KEY_INVALID", status: 401, userMessage: "Configuration Error: Invalid API credentials on the server." };
  }
  if (message.includes("quota") || message.includes("RESOURCE_EXHAUSTED") || message.includes("429")) {
    return { code: "QUOTA_EXCEEDED", status: 429, userMessage: "Service limit exceeded. Please wait a minute and retry." };
  }
  if (message.includes("model") && (message.includes("not found") || message.includes("not available"))) {
    return { code: "MODEL_UNAVAILABLE", status: 503, userMessage: "The AI model is temporarily unavailable. Please retry." };
  }
  if (message.includes("overloaded") || message.includes("503")) {
    return { code: "MODEL_UNAVAILABLE", status: 503, userMessage: "The AI model is temporarily overloaded. Please retry." };
  }
  if (message.includes("fetch failed") || message.includes("Failed to fetch") || message.includes("network") || message.includes("ECONNREFUSED")) {
    return { code: "NETWORK_FAILURE", status: 502, userMessage: "Connection Error: Network failure while connecting to AI services." };
  }
  if (message === "EMPTY_RESPONSE") {
    return { code: "EMPTY_RESPONSE", status: 502, userMessage: "Empty Response: The AI returned an empty response. Please retry." };
  }
  if (message.includes("JSON") || message.includes("parse") || message.includes("Unexpected")) {
    return { code: "MALFORMED_JSON", status: 502, userMessage: "Parsing Error: The response format was invalid. Please retry." };
  }
  return { code: "SERVER_ERROR", status: 500, userMessage: "An unexpected server error occurred. Please try again." };
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  console.log("[route] Request received");

  try {
    const body = await req.json();
    const { userProfile } = body || {};

    if (!userProfile) {
      return NextResponse.json(
        { success: false, message: "Missing userProfile in request body", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "Configuration Error: The GEMINI_API_KEY is missing on the server.", code: "CONFIG_ERROR" },
        { status: 500 }
      );
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    console.log(`[route] Model: ${modelName}`);

    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildPreparednessPrompt(userProfile);
    console.log(`[route] Prompt length: ${prompt.length} chars`);

    // 60-second timeout
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout Error: Gemini API exceeded the 60-second limit.")), 60000)
    );

    console.log("[route] Start Gemini request");
    console.time("[route] Gemini Request");

    const apiCallPromise = ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING },
            riskSummary: { type: Type.STRING },
            preparednessPlan: {
              type: Type.OBJECT,
              properties: {
                today: { type: Type.ARRAY, items: { type: Type.STRING } },
                tomorrow: { type: Type.ARRAY, items: { type: Type.STRING } },
                duringRain: { type: Type.ARRAY, items: { type: Type.STRING } },
                afterRain: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["today", "tomorrow", "duringRain", "afterRain"],
            },
            emergencyChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
            emergencyKit: { type: Type.ARRAY, items: { type: Type.STRING } },
            travelAdvisory: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING },
                recommendation: { type: Type.STRING },
                avoid: { type: Type.ARRAY, items: { type: Type.STRING } },
                safeOptions: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["status", "recommendation", "avoid", "safeOptions"],
            },
            safetyTips: {
              type: Type.OBJECT,
              properties: {
                before: { type: Type.ARRAY, items: { type: Type.STRING } },
                during: { type: Type.ARRAY, items: { type: Type.STRING } },
                after: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["before", "during", "after"],
            },
            communityRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            emergencyContacts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ["name", "reason"],
              },
            },
            language: { type: Type.STRING },
            finalMessage: { type: Type.STRING },
          },
          required: [
            "riskLevel", "riskSummary", "preparednessPlan",
            "emergencyChecklist", "emergencyKit", "travelAdvisory",
            "safetyTips", "communityRecommendations", "emergencyContacts",
            "language", "finalMessage",
          ],
        },
        temperature: 0.1,
        topP: 0.8,
        maxOutputTokens: 2048,
      },
    });

    const response = await Promise.race([apiCallPromise, timeoutPromise]);

    console.timeEnd("[route] Gemini Request");
    console.log("[route] End Gemini request");

    // Extract text — response.text is a getter (string | undefined)
    const text = response.text ?? "";

    console.log("[route] Raw Gemini response:", text.substring(0, 500));

    if (!text.trim()) {
      throw new Error("EMPTY_RESPONSE");
    }

    const parsed = safeParseJson(text);
    const plan = validateAndSanitize(parsed);

    console.log("[route] Returned response");
    return NextResponse.json({ success: true, plan });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[route] Pipeline error:", message);

    const { code, status, userMessage } = classifyError(message);

    return NextResponse.json(
      { success: false, message: userMessage, code },
      { status }
    );
  }
}
