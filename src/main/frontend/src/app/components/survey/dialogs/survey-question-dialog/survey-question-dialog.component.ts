import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {QuestionType} from "../../../../models/enums/questionType";
import {AnswerRequest} from "../../../../models/dto/request/answerRequest";
import {QuestionRequest} from "../../../../models/dto/request/questionRequest";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-survey-question-dialog',
  templateUrl: './survey-question-dialog.component.html',
  styleUrls: ['./survey-question-dialog.component.scss', '../dialog.scss']
})
export class SurveyQuestionDialogComponent implements OnInit{
  updatedQuestion: QuestionRequest;
  updatedQuestionAnswers: AnswerRequest[];
  isRating: boolean;

  constructor(
    public dialogRef: MatDialogRef<SurveyQuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { question: QuestionRequest, isRating: boolean },
  ) {
    this.updatedQuestion = { ...data.question };
    this.updatedQuestionAnswers = JSON.parse(JSON.stringify(data.question.answers));
    this.isRating = data.isRating;
  }

  ngOnInit(): void {
    if (this.isRating) {
      this.updatedQuestionAnswers.forEach(answer => {
        if (answer.score == null) {
          answer.score = 0;
        }
      })
    }
    }

  addAnswer() {
    const newAnswer: AnswerRequest = {
      answerText: 'Вариант ответа',
      score: this.isRating ? 0 : null,
      order: this.updatedQuestionAnswers.length + 1
    }

    this.updatedQuestionAnswers.push(newAnswer);
  }

  removeAnswer(answer: AnswerRequest) {
    const index = this.updatedQuestionAnswers.indexOf(answer);
    if (index !== -1) {
      this.updatedQuestionAnswers.splice(index, 1);
    }
  }

  saveQuestion() {
    this.updatedQuestion.answers = this.updatedQuestionAnswers;

    this.dialogRef.close(this.updatedQuestion);
  }

  cancel() {
    this.dialogRef.close(this.data.question);
  }

  onAnswerDropped(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.updatedQuestionAnswers, event.previousIndex, event.currentIndex);

    this.updatedQuestionAnswers.forEach((answer, index) => {
      answer.order = index;
    });
  }

  getQuestionIcon(questionType: QuestionType): string {
    // Map question type to the corresponding material icon
    switch (questionType) {
      case QuestionType.TEXT:
        return 'notes';
      case QuestionType.MULTIPLE:
        return 'check_box';
      case QuestionType.SINGLE:
        return 'radio_button_checked';
      default:
        return '';
    }
  }

  getAnswerIcon(questionType: QuestionType): string {
    switch (questionType) {
      case QuestionType.TEXT:
        return 'notes';
      case QuestionType.MULTIPLE:
        return 'check_box_outline_blank';
      case QuestionType.SINGLE:
        return 'radio_button_unchecked';
      default:
        return '';
    }
  }

  protected readonly QuestionType = QuestionType;
}
