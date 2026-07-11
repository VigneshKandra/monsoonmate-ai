import { QuestionnaireResponses } from "./types";

export const validateStep = (step: number, responses: QuestionnaireResponses): Record<string, string> => {
  const newErrors: Record<string, string> = {};

  if (step === 1) {
    if (!responses.location.country.trim()) newErrors.country = "Country name is required";
    if (!responses.location.state.trim()) newErrors.state = "State or Province is required";
    if (!responses.location.city.trim()) newErrors.city = "City or Town is required";
  } else if (step === 2) {
    if (!responses.prepTarget) newErrors.prepTarget = "Please select who you are preparing for";
  } else if (step === 3) {
    if (responses.householdInfo.length === 0) {
      newErrors.householdInfo = "Please select at least one household option";
    }
  } else if (step === 4) {
    if (!responses.houseType) newErrors.houseType = "Please select your primary house structure";
  } else if (step === 5) {
    if (!responses.transportation) newErrors.transportation = "Please select your primary travel option";
  } else if (step === 6) {
    if (!responses.language) newErrors.language = "Please select your preferred safety language";
  }

  return newErrors;
};
