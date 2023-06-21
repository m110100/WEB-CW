import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PatientSurveyInfo, SurveyInfoResponse} from "../models/dto/response/surveyInfoResponse";
import {LatestSurveyResponse} from "../models/dto/response/latestSurveyResponse";
import {SurveyRequest} from "../models/dto/request/surveyRequest";
import {QuestionResponse} from "../models/dto/response/questionResponse";
import {RecommendationResponse} from "../models/dto/response/recommendationResponse";
import {SurveyCompleteRequest} from "../models/dto/request/surveyCompleteRequest";
import {PatientResultsResponse} from "../models/dto/response/patientResultsResponse";

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(private http: HttpClient) { }

  createSurvey(survey: SurveyRequest): Observable<SurveyRequest> {
    return this.http.post<SurveyRequest>('/api/management/surveys', survey);
  }

  publishSurveyResults(surveyResults: SurveyCompleteRequest[]): Observable<void> {
    return this.http.post<void>('/api/management/surveys/survey-results', surveyResults);
  }

  deleteSurvey(surveyId: number): Observable<void> {
    return this.http.delete<void>(`/api/management/surveys/${surveyId}`);
  }

  getAllDoctorSurveys(doctorId: number): Observable<SurveyInfoResponse[]> {
    return this.http.get<SurveyInfoResponse[]>(`/api/management/surveys/doctor?id=${doctorId}`);
  }

  getAllPatientSurveys(patientId: number): Observable<PatientSurveyInfo[]> {
    return this.http.get<PatientSurveyInfo[]>(`/api/management/surveys/patient?id=${patientId}`);
  }

  getPatientResults(patientId: number, surveyId: number): Observable<PatientResultsResponse[]> {
    return this.http.get<PatientResultsResponse[]>(
      `/api/management/surveys/patient/results?patientId=${patientId}&surveyId=${surveyId}`
    );
  }

  getAllDoctorLatestSurveys(doctorId: number): Observable<LatestSurveyResponse[]> {
    return this.http.get<LatestSurveyResponse[]>(`/api/management/surveys/latest?id=${doctorId}`);
  }

  getSurvey(surveyId: number): Observable<SurveyInfoResponse> {
    return this.http.get<SurveyInfoResponse>(`/api/management/surveys/${surveyId}`);
  }

  getAllSurveyQuestions(surveyId: number): Observable<QuestionResponse[]> {
    return this.http.get<QuestionResponse[]>(`/api/management/surveys/${surveyId}/questions`);
  }

  getAllSurveyRecommendations(surveyId: number): Observable<RecommendationResponse[]> {
    return this.http.get<RecommendationResponse[]>(`/api/management/surveys/${surveyId}/recommendations`);
  }
}
