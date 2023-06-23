import {PatientResultsQuestionResponse} from "./patientResultsQuestionResponse";

export interface PatientResultsResponse {
  givenRecommendation: string | null,
  question: PatientResultsQuestionResponse,
  givenAnswer: string
}
