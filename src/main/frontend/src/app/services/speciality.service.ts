import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SpecialityResponse} from "../models/dto/response/specialityResponse";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpecialityService {

  constructor(private http: HttpClient) { }

  getAllSpecialities(): Observable<SpecialityResponse[]> {
    return this.http.get<SpecialityResponse[]>("/api/management/specialities");
  }
}
