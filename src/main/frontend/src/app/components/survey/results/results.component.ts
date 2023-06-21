import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SurveyService} from "../../../services/survey.service";
import {PatientResultsResponse} from "../../../models/dto/response/patientResultsResponse";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  results: PatientResultsResponse[];

  constructor(
    private route: ActivatedRoute,
    private surveyService: SurveyService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const surveyId = params['surveyId'];
      const patientId = params['surveyId'];

      this.surveyService.getPatientResults(patientId, surveyId)
        .subscribe((results: PatientResultsResponse[]) => {
          this.results = results;
          console.log(this.results);
      })
    })
  }
}
