import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {QuestionRequest} from "../../../../models/dto/request/questionRequest";

@Component({
  selector: 'app-given-recommendation',
  templateUrl: './given-recommendation.component.html',
  styleUrls: ['./given-recommendation.component.scss', '../dialog.scss']
})
export class GivenRecommendationComponent {
  recommendationText: string;

  constructor(
    public dialogRef: MatDialogRef<GivenRecommendationComponent>,
    @Inject(MAT_DIALOG_DATA) public recommendation: string
  ) {
    this.recommendationText = recommendation;
  }

  close() {
    this.dialogRef.close();
  }
}
