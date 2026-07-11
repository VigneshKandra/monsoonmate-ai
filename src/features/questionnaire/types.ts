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
