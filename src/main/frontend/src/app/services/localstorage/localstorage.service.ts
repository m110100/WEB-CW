import { Injectable } from '@angular/core';
import {SurveyRequest} from "../../models/dto/request/surveyRequest";

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  private readonly SURVEY_KEY = 'savedSurvey';
  constructor() { }

  getSurvey(): SurveyRequest {
    const storedData = localStorage.getItem(this.SURVEY_KEY);

    if (storedData) {
      return JSON.parse(storedData) as SurveyRequest;
    }
    return null!;
  }

  clearSurvey() {
    localStorage.removeItem(this.SURVEY_KEY);
  }

  saveSurvey(survey: SurveyRequest) {
    localStorage.setItem(this.SURVEY_KEY, JSON.stringify(survey));
  }
}
