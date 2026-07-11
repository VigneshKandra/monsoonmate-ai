import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { PreparednessPlanResponse, EmergencyContact } from "@/types/planner";
import { buildPreparednessPrompt } from "@/prompts/preparednessPrompt";

function cleanJsonResponse(rawText: string): string {
  let cleaned = rawText.trim();
  
  // Remove markdown code fences
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  
  return cleaned.trim();
}

function validateAndSanitizeResponse(raw: Record<string, unknown>): PreparednessPlanResponse {
  const sanitized: Partial<PreparednessPlanResponse> = {};

  // 1. Strings Validation
  sanitized.riskLevel = typeof raw.riskLevel === "string" && raw.riskLevel.trim() 
    ? raw.riskLevel.trim() 
    : "Low";
  
  sanitized.riskSummary = typeof raw.riskSummary === "string" && raw.riskSummary.trim()
    ? raw.riskSummary.trim()
    : "No detailed meteorological risk summary could be compiled for this profile.";

  sanitized.language = typeof raw.language === "string" && raw.language.trim()
    ? raw.language.trim()
    : "English";

  sanitized.finalMessage = typeof raw.finalMessage === "string" && raw.finalMessage.trim()
    ? raw.finalMessage.trim()
    : "Please prioritize safety, stay informed of local reports, and follow civil warning procedures.";

  // 2. Preparedness Plan Timeline
  const rawPlan = (raw.preparednessPlan && typeof raw.preparednessPlan === "object"
    ? raw.preparednessPlan
    : {}) as Record<string, unknown>;

  sanitized.preparednessPlan = {
    today: Array.isArray(rawPlan.today) ? rawPlan.today.filter((i): i is string => typeof i === "string") : [],
    tomorrow: Array.isArray(rawPlan.tomorrow) ? rawPlan.tomorrow.filter((i): i is string => typeof i === "string") : [],
    duringRain: Array.isArray(rawPlan.duringRain) ? rawPlan.duringRain.filter((i): i is string => typeof i === "string") : [],
    afterRain: Array.isArray(rawPlan.afterRain) ? rawPlan.afterRain.filter((i): i is string => typeof i === "string") : []
  };

  if (sanitized.preparednessPlan.today.length === 0) {
    sanitized.preparednessPlan.today = ["Monitor local municipal alerts and emergency announcements."];
  }
  if (sanitized.preparednessPlan.tomorrow.length === 0) {
    sanitized.preparednessPlan.tomorrow = ["Conduct structural checks around your immediate premises."];
  }
  if (sanitized.preparednessPlan.duringRain.length === 0) {
    sanitized.preparednessPlan.duringRain = ["Stay indoors and keep electronic appliances disconnected."];
  }
  if (sanitized.preparednessPlan.afterRain.length === 0) {
    sanitized.preparednessPlan.afterRain = ["Check property structures for leakage or water stagnation."];
  }

  // 3. Simple Arrays
  sanitized.emergencyChecklist = Array.isArray(raw.emergencyChecklist)
    ? raw.emergencyChecklist.filter((i): i is string => typeof i === "string")
    : [];
  if (sanitized.emergencyChecklist.length === 0) {
    sanitized.emergencyChecklist = [
      "Secure windows and balconies against strong wind vectors.",
      "Verify emergency backup power bank levels.",
      "Confirm emergency transit pathways are clear."
    ];
  }

  sanitized.emergencyKit = Array.isArray(raw.emergencyKit)
    ? raw.emergencyKit.filter((i): i is string => typeof i === "string")
    : [];
  if (sanitized.emergencyKit.length === 0) {
    sanitized.emergencyKit = [
      "Dry food rations and sealed drinking water",
      "First aid medical kit with custom prescriptions",
      "Flashlight with spare batteries",
      "Emergency power bank for mobile connectivity"
    ];
  }

  sanitized.communityRecommendations = Array.isArray(raw.communityRecommendations)
    ? raw.communityRecommendations.filter((i): i is string => typeof i === "string")
    : [];
  if (sanitized.communityRecommendations.length === 0) {
    sanitized.communityRecommendations = [
      "Share emergency cell numbers with immediate neighbors.",
      "Check drainage inlets around property perimeters."
    ];
  }

  // 4. Travel Advisory Object
  const rawTravel = (raw.travelAdvisory && typeof raw.travelAdvisory === "object"
    ? raw.travelAdvisory
    : {}) as Record<string, unknown>;

  sanitized.travelAdvisory = {
    status: typeof rawTravel.status === "string" && rawTravel.status.trim()
      ? rawTravel.status.trim()
      : "Advisory",
    recommendation: typeof rawTravel.recommendation === "string" && rawTravel.recommendation.trim()
      ? rawTravel.recommendation.trim()
      : "Exercise caution during high rainfall spells.",
    avoid: Array.isArray(rawTravel.avoid) ? rawTravel.avoid.filter((i): i is string => typeof i === "string") : [],
    safeOptions: Array.isArray(rawTravel.safeOptions) ? rawTravel.safeOptions.filter((i): i is string => typeof i === "string") : []
  };

  if (sanitized.travelAdvisory.avoid.length === 0) {
    sanitized.travelAdvisory.avoid = ["Underpasses, low-lying storm channels, and waterlogged segments."];
  }
  if (sanitized.travelAdvisory.safeOptions.length === 0) {
    sanitized.travelAdvisory.safeOptions = ["Stay indoors or use municipal transit lines tracking applications."];
  }

  // 5. Safety Tips Object
  const rawTips = (raw.safetyTips && typeof raw.safetyTips === "object"
    ? raw.safetyTips
    : {}) as Record<string, unknown>;

  sanitized.safetyTips = {
    before: Array.isArray(rawTips.before) ? rawTips.before.filter((i): i is string => typeof i === "string") : [],
    during: Array.isArray(rawTips.during) ? rawTips.during.filter((i): i is string => typeof i === "string") : [],
    after: Array.isArray(rawTips.after) ? rawTips.after.filter((i): i is string => typeof i === "string") : []
  };

  if (sanitized.safetyTips.before.length === 0) {
    sanitized.safetyTips.before = ["Audit roof leaks and check gutter blockages."];
  }
  if (sanitized.safetyTips.during.length === 0) {
    sanitized.safetyTips.during = ["Avoid touching metal railings or water logging fields."];
  }
  if (sanitized.safetyTips.after.length === 0) {
    sanitized.safetyTips.after = ["Prevent mosquito breeding sites by clearing stagnating pools."];
  }

  // 6. Emergency Contacts Array
  const rawContacts = raw.emergencyContacts;
  const contactsList: EmergencyContact[] = [];
  if (Array.isArray(rawContacts)) {
    rawContacts.forEach((contact) => {
      if (contact && typeof contact === "object") {
        const c = contact as Record<string, unknown>;
        if (typeof c.name === "string" && typeof c.reason === "string") {
          contactsList.push({
            name: c.name.trim(),
            reason: c.reason.trim()
          });
        }
      }
    });
  }
  
  if (contactsList.length === 0) {
    sanitized.emergencyContacts = [
      { name: "National Emergency Number", reason: "General emergency alerts (Dial 112)" },
      { name: "Municipal Disaster Control", reason: "Waterlogging or rescue support updates" }
    ];
  } else {
    sanitized.emergencyContacts = contactsList;
  }

  return sanitized as PreparednessPlanResponse;
}

export async function POST(req: NextRequest) {
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
        {
          success: false,
          message: "Configuration Error: The GEMINI_API_KEY is missing on the server. Please check your environments.",
          code: "CONFIG_ERROR"
        },
        { status: 500 }
      );
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-3.5-flash";
    const ai = new GoogleGenAI({ apiKey });

    const prompt = buildPreparednessPrompt(userProfile);

    // 60-second timeout
    const timeoutDuration = 60000;
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Timeout Error: The request to Gemini API exceeded the 60-second response limit.")),
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
    
    console.log("========== GEMINI RESPONSE ==========");
    console.timeEnd("Gemini Request");
    console.log("Gemini response received.");
    
    const text = response.text || "";
    console.log("RAW RESPONSE");
    console.log(text);

    if (!text.trim()) {
      return NextResponse.json(
        { success: false, message: "Empty Response: The AI response returned empty.", code: "EMPTY_RESPONSE" },
        { status: 502 }
      );
    }

    const cleaned = cleanJsonResponse(text);

    console.log("========== CLEANED RESPONSE ==========");
    console.log(cleaned);

    try {
      const rawParsed = JSON.parse(cleaned) as Record<string, unknown>;
      const sanitizedPlan = validateAndSanitizeResponse(rawParsed);
      
      return NextResponse.json({
        success: true,
        plan: sanitizedPlan
      });
    } catch (parseError) {
      console.error("JSON PARSE FAILED", parseError);
      console.error(cleaned);

      return NextResponse.json({
        success: false,
        message: "JSON_PARSE_ERROR: Received an invalid format from the server.",
        code: "MALFORMED_JSON",
        raw: cleaned
      }, { status: 502 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("API ROUTE FAULT:", message);

    let code = "SERVER_ERROR";
    let status = 500;
    let userMessage = "An unexpected server error occurred. Please try again.";

    if (message.includes("Timeout Error")) {
      code = "REQUEST_TIMEOUT";
      status = 504;
      userMessage = "The safety plan generation request timed out. Please check your connection speed and retry.";
    } else if (
      message.includes("API key not valid") || 
      message.includes("API_KEY_INVALID") || 
      message.includes("API key expired") || 
      message.includes("401")
    ) {
      code = "API_KEY_INVALID";
      status = 401;
      userMessage = "Invalid configuration credentials. The server key could not be authenticated.";
    } else if (
      message.includes("quota") || 
      message.includes("RESOURCE_EXHAUSTED") || 
      message.includes("limit") || 
      message.includes("429")
    ) {
      code = "QUOTA_EXCEEDED";
      status = 429;
      userMessage = "Service limit exceeded. MonsoonMate is experiencing high volume. Please wait a minute and retry.";
    } else if (
      message.includes("model not found") || 
      message.includes("not available") || 
      message.includes("503") || 
      message.includes("overloaded")
    ) {
      code = "MODEL_UNAVAILABLE";
      status = 503;
      userMessage = "The AI compilation model is temporarily overloaded or unavailable. Please click retry.";
    } else if (
      message.includes("fetch failed") || 
      message.includes("Failed to fetch") || 
      message.includes("network") || 
      message.includes("connect")
    ) {
      code = "NETWORK_FAILURE";
      status = 500;
      userMessage = "Network failure while connecting to AI services. Please verify your connection and try again.";
    }

    return NextResponse.json(
      { success: false, message: userMessage, code },
      { status }
    );
  }
}
