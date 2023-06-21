import {PatientResultsQuestionResponse} from "./patientResultsQuestionResponse";

export interface PatientResultsResponse {
  givenRecommendation: string,
  question: PatientResultsQuestionResponse,
  givenAnswer: string
}
