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
  "Building emergency checklist...",
  "Preparing travel advisory...",
  "Creating personalized recommendations...",
  "Almost ready..."
];
