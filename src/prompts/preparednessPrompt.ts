import { QuestionnaireResponses } from "@/types/planner";

export function buildPreparednessPrompt(userProfile: QuestionnaireResponses): string {
  return `
You are a JSON generator. Your job is to output a personalized monsoon preparedness plan.
Return ONLY valid RFC8259 JSON matching the schema. Never explain, apologize, or use markdown code fences.

User Profile:
${JSON.stringify(userProfile, null, 2)}

Important Rules:
1. Personalize all items based on geography (location), family members (especially vulnerabilities like children, seniors, pregnant, or disabled members), pets, house type, and transportation modes.
2. Never invent weather data. If current forecasting is unknown, declare logical climate assumptions for the region instead.
3. Translate all values to the user's preferred language, but keep JSON keys in English.

Example Valid JSON Response Output:
{
  "riskLevel": "Moderate",
  "riskSummary": "Moderate storm alert: heavy spells expected over Mumbai.",
  "preparednessPlan": {
    "today": ["Procure 3 days of bottled drinking water.", "Charge all emergency power banks."],
    "tomorrow": ["Clear balcony gutters.", "Double-check window seals."],
    "duringRain": ["Stay indoors.", "Unplug high-voltage appliances."],
    "afterRain": ["Check drains for standing water.", "Audit walls for leaks."]
  },
  "emergencyChecklist": ["Verify backup formulas for children.", "Store pet transport crates near the door."],
  "emergencyKit": ["First-aid kit", "Battery-operated flashlights", "Sealed dry fruits"],
  "travelAdvisory": {
    "status": "Advisory",
    "recommendation": "Avoid travel during peak precipitation hours.",
    "avoid": ["Low-lying subway passes", "Waterlogged lanes"],
    "safeOptions": ["Using public rails", "Working from home"]
  },
  "safetyTips": {
    "before": ["Clean all roof leaves.", "Charge primary power sources."],
    "during": ["Disconnect charging phones.", "Stay away from glass windows."],
    "after": ["Clear stagnant pools.", "Wear rubber boots when stepping out."]
  },
  "communityRecommendations": ["Alert senior neighbors of flood status.", "Check communal drains."],
  "emergencyContacts": [
    {
      "name": "Mumbai Disaster Helpline",
      "reason": "Report waterlogging or request rescue"
    }
  ],
  "language": "English",
  "finalMessage": "Prioritize family safety and monitor local updates."
}
`;
}