import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SurveyInfoResponse} from "../models/dto/response/surveyInfoResponse";
import {
  AppointmentDoctorsResponse,
  AppointmentPatientsResponse
} from "../models/dto/response/appointmentPatientsResponse";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  getAllDoctorAppointmentPatients(doctorId: number): Observable<AppointmentPatientsResponse[]> {
    return this.http.get<AppointmentPatientsResponse[]>(`/api/management/appointments/doctor?id=${doctorId}`);
  }

  getAllPatientAppointmentDoctors(patientId: number): Observable<AppointmentDoctorsResponse[]> {
    return this.http.get<AppointmentDoctorsResponse[]>(`/api/management/appointments/patient?id=${patientId}`);
  }
}
