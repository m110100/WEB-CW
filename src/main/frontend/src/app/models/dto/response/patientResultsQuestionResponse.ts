import {QuestionType} from "../../enums/questionType";

export interface PatientResultsQuestionResponse {
  id: number,
  questionText: string,
  questionType: QuestionType
}
