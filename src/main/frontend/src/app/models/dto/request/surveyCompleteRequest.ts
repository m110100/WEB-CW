import {RecommendationResponse} from "../response/recommendationResponse";
import {QuestionResponse} from "../response/questionResponse";
import {SurveyInfoResponse} from "../response/surveyInfoResponse";

export interface SurveyCompleteRequest {
  question: QuestionResponse,
  givenAnswer: string,
  recommendation: RecommendationResponse | null,
  survey: SurveyInfoResponse,
  userId: number
}
