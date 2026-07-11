import { QuestionnaireResponses } from "@/types/planner";

export function buildPreparednessPrompt(
  userProfile: QuestionnaireResponses
): string {
  return `
You are an expert disaster preparedness officer helping citizens prepare for the monsoon season.

USER PROFILE

${JSON.stringify(userProfile, null, 2)}

IMPORTANT

Return ONLY valid RFC8259 JSON.

Your response MUST:

- Begin with {
- End with }
- Never include markdown
- Never include \`\`\`
- Never include explanations
- Never include comments
- Never omit any field
- Never add extra fields
- Every field must contain meaningful values
- All arrays must contain at least 3 items where applicable

Generate practical recommendations based on:

- Location
- Household members
- House type
- Transportation
- Preferred language

Never invent live weather.

Assume standard monsoon conditions for the given location.

Return EXACTLY this JSON structure:

{
  "riskLevel":"Low",
  "riskSummary":"",

  "preparednessPlan":{
      "today":[
          "",
          "",
          ""
      ],
      "tomorrow":[
          "",
          "",
          ""
      ],
      "duringRain":[
          "",
          "",
          ""
      ],
      "afterRain":[
          "",
          "",
          ""
      ]
  },

  "emergencyChecklist":[
      "",
      "",
      ""
  ],

  "emergencyKit":[
      "",
      "",
      ""
  ],

  "travelAdvisory":{
      "status":"",
      "recommendation":"",
      "avoid":[
          "",
          "",
          ""
      ],
      "safeOptions":[
          "",
          "",
          ""
      ]
  },

  "safetyTips":{
      "before":[
          "",
          "",
          ""
      ],
      "during":[
          "",
          "",
          ""
      ],
      "after":[
          "",
          "",
          ""
      ]
  },

  "communityRecommendations":[
      "",
      "",
      ""
  ],

  "emergencyContacts":[
      {
          "name":"",
          "reason":""
      }
  ],

  "language":"",

  "finalMessage":""
}
`;
}