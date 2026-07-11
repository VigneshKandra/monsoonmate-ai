export interface LocationData {
  country: string;
  state: string;
  city: string;
  pinCode: string;
}

export interface QuestionnaireResponses {
  location: LocationData;
  prepTarget: string;
  householdInfo: string[];
  houseType: string;
  transportation: string;
  language: string;
}

export interface EmergencyContact {
  name: string;
  reason: string;
}

export interface TravelAdvisory {
  status: string;
  recommendation: string;
  avoid: string[];
  safeOptions: string[];
}

export interface SafetyTips {
  before: string[];
  during: string[];
  after: string[];
}

export interface PreparednessPlanDetails {
  today: string[];
  tomorrow: string[];
  duringRain: string[];
  afterRain: string[];
}

export interface PreparednessPlanResponse {
  riskLevel: string;
  riskSummary: string;
  preparednessPlan: PreparednessPlanDetails;
  emergencyChecklist: string[];
  emergencyKit: string[];
  travelAdvisory: TravelAdvisory;
  safetyTips: SafetyTips;
  communityRecommendations: string[];
  emergencyContacts: EmergencyContact[];
  language: string;
  finalMessage: string;
}
