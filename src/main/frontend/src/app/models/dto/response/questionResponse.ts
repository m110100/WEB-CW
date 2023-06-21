import {QuestionType} from "../../enums/questionType";
import {AnswerResponse} from "./answerResponse";

export interface QuestionResponse {
  id: number,
  questionText: string,
  questionType: QuestionType,
  order: number,
  inputMinLimit: number | null,
  inputMaxLimit: number | null,
  answers: AnswerResponse[]
}
