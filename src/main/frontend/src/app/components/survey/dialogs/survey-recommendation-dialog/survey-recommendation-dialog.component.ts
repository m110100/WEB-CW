import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RecommendationRequest} from "../../../../models/dto/request/recommendationRequest";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-survey-recommendation-dialog',
  templateUrl: './survey-recommendation-dialog.component.html',
  styleUrls: ['./survey-recommendation-dialog.component.scss', '../dialog.scss']
})
export class SurveyRecommendationDialogComponent implements OnInit{
  updatedRecommendationForm: FormGroup;
  updatedRecommendation: RecommendationRequest;

  constructor(
    public dialogRef: MatDialogRef<SurveyRecommendationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public recommendation: RecommendationRequest,
  ) {
    this.updatedRecommendation = { ...recommendation };
  }

  ngOnInit() {
    this.updatedRecommendationForm = new FormGroup({
      recommendationText: new FormControl('', [Validators.required]),
      recommendationMinScore: new FormControl(0, [Validators.required, Validators.min(0)]),
      recommendationMaxScore: new FormControl(0, [Validators.required, Validators.min(0)])

    })
  }

  cancel() {
    this.dialogRef.close(this.recommendation);
  }

  saveRecommendation() {
    if (this.updatedRecommendationForm.invalid) {
      return;
    }

    this.updatedRecommendation.recommendationText = this.updatedRecommendationForm.value.recommendationText;
    this.updatedRecommendation.minScore = this.updatedRecommendationForm.value.recommendationMinScore;
    this.updatedRecommendation.maxScore = this.updatedRecommendationForm.value.recommendationMaxScore;

    this.dialogRef.close(this.updatedRecommendation);
  }
}
