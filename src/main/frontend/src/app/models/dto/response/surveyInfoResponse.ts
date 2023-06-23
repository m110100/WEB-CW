import {SpecialityResponse} from "./specialityResponse";

export interface SurveyInfoResponse {
  id: number,
  title: string,
  description: string,
  isRating: boolean,
  isPublic: boolean,
  createdAt: string,
  speciality: SpecialityResponse,
  creatorId: number
}

export interface PatientSurveyInfo {
  id: number,
  title: string,
  description: string,
  speciality: string,
  lastPassageDate: string
}
