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
You are a senior disaster preparedness officer, emergency response planner, weather risk analyst, and public safety expert with decades of experience coordinating civil defense operations.

Your sole objective is to compile a highly personalized, practical, and action-oriented Monsoon Preparedness Plan for the user profile provided below.

<user_profile>
${JSON.stringify(userProfile, null, 2)}
</user_profile>

<output_rules>
- Return ONLY a raw JSON string. Do not wrap in markdown code blocks, do not write code fences (e.g. no \`\`\`json ... \`\`\`), do not write any pre-amble, explanation, or post-amble text.
- The output must be valid, parseable JSON conforming EXACTLY to the schema provided.
- Translate all content (recommendations, checklist items, text blocks, reasons) to the user's preferred language specified in the user profile. Do NOT translate JSON structure keys.
</output_rules>

<personalization_directives>
Analyze the user profile systematically:
1. **Location**: Personalize safety steps based on state and city monsoon behaviors (e.g., coastal surge risks for Mumbai, drainage block risks, local river overflows).
2. **Household Dependencies**:
   - If 'children' in list: Add child-safety rules, toys/diaper stockpiling, school check-ins.
   - If 'senior' in list: Add prescription medicine audits, power-outage backups for medical aids.
   - If 'pregnant' in list: Add emergency hospital transport planning, clean delivery room prep details.
   - If 'disabilities' in list: Add mobility aid battery checks, local emergency contact register alerts.
   - If 'pets' in list: Add pet food, carrier bags, and identification tag checks.
3. **House Type**:
   - If 'apartment': Focus on window sealing, balcony drain checks, elevator safety protocols.
   - If 'independent': Focus on roof leak audits, tree branch trimming, terrace block clears.
   - If 'village': Focus on wall reinforcements, storm runoff ditches, roof tie-downs.
   - If 'flood' (lowland): Prioritize sandbags, elevating ground-level electronics, clean water store elevations.
4. **Transportation Mode**:
   - If 'car': Focus on window hammer availability, alternate route mapping, avoiding subways.
   - If 'bike': Focus on reflective safety coats, brake grip adjustments, high-wind steering.
   - If 'public': Focus on train/bus transit tracking apps, rain gear, commuter warnings.
   - If 'none': Focus on walking safety, storm surge updates, safe footpaths.
</personalization_directives>

<hallucination_prevention_directives>
- NEVER invent current temperature, exact rainfall millimeters, or live weather forecast figures.
- Instead, clearly declare local assumptions based on the geography (e.g., "Assuming standard high precipitation patterns during the southwest monsoon in Mumbai...").
- Keep recommendations strictly practical and relevant to the monsoon season.
</hallucination_prevention_directives>

<json_schema>
{
  "riskLevel": "Low | Moderate | High | Severe",
  "riskSummary": "A concise, geographic-specific summary explaining the risk level and stating standard monsoon assumptions.",
  "preparednessPlan": {
    "today": ["List of 3-5 immediate critical actions to secure safety today"],
    "tomorrow": ["List of 3-5 structural and logistical items to execute tomorrow"],
    "duringRain": ["List of 3-5 emergency safety actions to follow while it is raining heavily"],
    "afterRain": ["List of 3-5 recovery and wellness steps to run after the storm passes (drainage checks, vector safety)"]
  },
  "emergencyChecklist": ["3-5 customized safety checkpoints matching the household dependents, house structure, and language"],
  "emergencyKit": ["4-6 critical provisions to pack in a waterproof bag, customized for their situation (medical supplies for seniors, child needs, pet food, etc.)"],
  "travelAdvisory": {
    "status": "Safe | Advisory | Danger",
    "recommendation": "A detailed travel advisory message matching their transportation mode and location details.",
    "avoid": ["List of 2-3 situations/areas to avoid based on transportation mode"],
    "safeOptions": ["List of 2-3 safe transit options or actions to take"]
  },
  "safetyTips": {
    "before": ["3 customized tips for preparation phase"],
    "during": ["3 customized tips for safety in storm"],
    "after": ["3 customized safety tips post-storm"]
  },
  "communityRecommendations": ["2-3 actions to coordinate with neighbors (drainage clearing, contact sharing, checking on vulnerable elders)"],
  "emergencyContacts": [
    {
      "name": "Specific local helpline or response contact names (e.g., Mumbai Disaster Control, National Emergency Line, local fire force)",
      "reason": "Why the user should dial this number (e.g., for reporting waterlogging, rescue support, medical emergencies)"
    }
  ],
  "language": "The name of the language the document is translated in",
  "finalMessage": "A short, encouraging and authoritative safety warning statement by a civil safety officer."
}
</json_schema>
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
