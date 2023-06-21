import {SpecialityResponse} from "../response/specialityResponse";
import {QuestionRequest} from "./questionRequest";
import {RecommendationRequest} from "./recommendationRequest";

export interface SurveyRequest {
  title: string,
  description: string,
  isRating: boolean,
  isPublic: boolean,
  speciality: SpecialityResponse | null,
  questions: QuestionRequest[],
  recommendations: RecommendationRequest[] | null,
  userId: number
}
