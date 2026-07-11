import { GoogleGenAI } from "@google/genai";
import { QuestionnaireResponses, PreparednessPlanResponse } from "@/types/planner";

export async function generatePreparednessPlan(userProfile: QuestionnaireResponses): Promise<PreparednessPlanResponse> {
  // 1. API Key Check
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Configuration Error: The Gemini API Key is missing. Please check that the NEXT_PUBLIC_GEMINI_API_KEY environment variable is configured correctly."
    );
  }

  // 2. Internet Connectivity Check
  if (typeof window !== "undefined" && !navigator.onLine) {
    throw new Error(
      "Connection Error: No active internet connection detected. Please verify your network and click retry."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are a senior disaster preparedness officer, emergency response planner, weather risk analyst, and public safety expert.

Your responsibility is to generate a personalized monsoon preparedness plan.

The user profile is:
${JSON.stringify(userProfile, null, 2)}

Return ONLY valid JSON.
No markdown.
No explanations.
No code fences.

The JSON schema must be:
{
  "riskLevel": "",
  "riskSummary": "",
  "preparednessPlan": {
    "today": [],
    "tomorrow": [],
    "duringRain": [],
    "afterRain": []
  },
  "emergencyChecklist": [],
  "emergencyKit": [],
  "travelAdvisory": {
    "status": "",
    "recommendation": "",
    "avoid": [],
    "safeOptions": []
  },
  "safetyTips": {
    "before": [],
    "during": [],
    "after": []
  },
  "communityRecommendations": [],
  "emergencyContacts": [
    {
      "name": "",
      "reason": ""
    }
  ],
  "language": "",
  "finalMessage": ""
}

Rules:
Personalize every recommendation.
Consider:
- location
- family composition
- children
- elderly
- pregnant women
- disabled people
- pets
- house type
- transportation
- preferred language

Use practical advice.
Never hallucinate unavailable weather data.
If weather information is unavailable, clearly state assumptions.
Return ONLY JSON.
`;

  try {
    // 3. Timeout Logic wrapped in a Promise race (15-second timeout)
    const timeoutDuration = 15000;
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Timeout Error: The request to Gemini API exceeded the 15-second response limit. Please try again.")),
        timeoutDuration
      )
    );

    const apiCallPromise = ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const response = await Promise.race([apiCallPromise, timeoutPromise]);

    const text = response.text;
    
    // 4. Empty Response Check
    if (!text) {
      throw new Error("Empty Response: The AI response returned empty. Please retry plan compilation.");
    }

    try {
      // 5. Invalid JSON Parsing Check
      const parsedPlan: PreparednessPlanResponse = JSON.parse(text);
      return parsedPlan;
    } catch {
      throw new Error("Parsing Error: Received an invalid plan format from the server. Please try again.");
    }
  } catch (apiError: unknown) {
    // 6. Generic/Network exceptions mapping
    const message = apiError instanceof Error ? apiError.message : String(apiError);
    
    if (message.includes("fetch failed") || message.includes("Failed to fetch")) {
      throw new Error("Network Error: Failed to communicate with Gemini API. Check your internet connection or DNS configurations.");
    }
    
    // Rethrow timeout/parsing/empty errors directly, and wrap others as unexpected server errors
    if (
      message.startsWith("Timeout Error") ||
      message.startsWith("Empty Response") ||
      message.startsWith("Parsing Error")
    ) {
      throw apiError;
    }
    
    throw new Error(`Unexpected Server Error: ${message}`);
  }
}
