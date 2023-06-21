import {QuestionType} from "../../enums/questionType";
import {AnswerRequest} from "./answerRequest";

export interface QuestionRequest {
  questionText: string,
  questionType: QuestionType,
  order: number,
  inputMinLimit: number | null,
  inputMaxLimit: number | null,
  answers: AnswerRequest[]
}
