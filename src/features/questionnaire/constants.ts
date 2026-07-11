import { QuestionnaireResponses } from "./types";

export const initialResponses: QuestionnaireResponses = {
  location: {
    country: "",
    state: "",
    city: "",
    pinCode: "",
  },
  prepTarget: "",
  householdInfo: [],
  houseType: "",
  transportation: "",
  language: "",
};

export const loadingMessages = [
  "Analyzing your location...",
  "Assessing monsoon risk...",
  "Preparing emergency checklist...",
  "Building travel advisory...",
  "Generating personalized recommendations...",
  "Almost ready..."
];
