import { QuestionnaireResponses, PreparednessPlanResponse } from "@/types/planner";

export async function generatePreparednessPlan(userProfile: QuestionnaireResponses): Promise<PreparednessPlanResponse> {
  // 1. Internet Connectivity Check (Client-side)
  if (typeof window !== "undefined" && !navigator.onLine) {
    throw new Error(
      "Connection Error: No active internet connection detected. Please verify your network and click retry."
    );
  }

  try {
    const response = await fetch("/api/generate-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userProfile }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data.plan;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}
