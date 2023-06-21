import {Component, OnInit} from '@angular/core';
import {PatientSurveyInfo, SurveyInfoResponse} from "../../../models/dto/response/surveyInfoResponse";
import {AuthService} from "../../../services/auth/auth.service";
import {SurveyService} from "../../../services/survey.service";
import {User} from "../../../models/user";
import {LatestSurveyResponse} from "../../../models/dto/response/latestSurveyResponse";
import {SpecialityResponse} from "../../../models/dto/response/specialityResponse";
import {SpecialityService} from "../../../services/speciality.service";
import {AccessPassingSurveyGuard} from "../../../guards/access-passing-survey.guard";
import {Router} from "@angular/router";

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.scss']
})
export class SurveysComponent implements OnInit {
  hoverSidenav: boolean = false;
  sidenavItems = [
    {
      icon: 'space_dashboard',
      text: 'Обзор',
      link: '/dashboard',
      roles: ['PATIENT', 'DOCTOR']
    },
    {
      icon: 'assignment',
      text: 'Список опросов',
      link: '/surveys',
      roles: ['PATIENT', 'DOCTOR']
    },
    {
      icon: 'assignment_add',
      text: 'Создать опрос',
      link: '/create-survey',
      roles: ['DOCTOR']
    },
    {
      icon: 'logout',
      text: 'Выход',
    },
  ]

  shouldDisplayMenuItem(item: any): boolean {
    const userRole = this.user.role;

    if (item.roles && item.roles.includes(userRole)) {
      return true;
    }
    return !item.roles;
  }

  menuItemClicked(item: any): void {
    if (item.icon === 'logout') {
      this.logout();
    } else {
      return;
    }
  }

  doctorSurveyDisplayedColumns: string[] = ['title', 'isPublic', 'isRating', 'createdAt', 'actions'];
  patientSurveyDisplayedColumns: string[] = ['title', 'speciality', 'lastPassageDate', 'actions'];

  inputFilter: string = '';
  specialityFilter: string = '';

  constructor(
    private accessGuard: AccessPassingSurveyGuard,
    private router: Router,
    private authService: AuthService,
    private specialityService: SpecialityService,
    private surveyService: SurveyService
  ) {}

  user: User;
  doctorSurveys: SurveyInfoResponse[] = [];
  specialities: SpecialityResponse[] = [];
  patientSurveys: PatientSurveyInfo[] = [];


  ngOnInit() {
    this.user = this.authService.getUser();

    this.loadDoctorSurveys();
    this.loadPatientSurveys();
    this.loadSpecialities();
  }

  loadDoctorSurveys() {
    if (this.user.role === 'DOCTOR') {
      this.surveyService.getAllDoctorSurveys(this.user.id).subscribe((surveys: SurveyInfoResponse[]) => {
          this.doctorSurveys = surveys;
        },
        error => {
          console.log(error);
        })
    }
  }

  loadPatientSurveys() {
    if (this.user.role === 'PATIENT') {
      this.surveyService.getAllPatientSurveys(this.user.id).subscribe((surveys: PatientSurveyInfo[]) => {
        this.patientSurveys = surveys;
      }, error =>  {
        console.log(error);
      })
    }
  }

  loadSpecialities() {
    this.specialityService.getAllSpecialities().subscribe((specialities: SpecialityResponse[]) => {
        this.specialities = specialities;
      },
      error => {
        console.log(error);
      })
  }

  deleteSurvey(survey: SurveyInfoResponse) {
    const id: number = survey.id;
    const surveyIndex: number = this.doctorSurveys.indexOf(survey);

    this.surveyService.deleteSurvey(id).subscribe(() => {
      this.doctorSurveys.splice(surveyIndex, 1);
    }, error => {
      console.log(error);
    })
  }

  isSurveyMatch(survey: SurveyInfoResponse): boolean {
    const inputMatch = !this.inputFilter ||
      survey.title.toLowerCase().includes(this.inputFilter.toLowerCase());

    const specialityMatch = !this.specialityFilter ||
      (survey.speciality && survey.speciality.name.toLowerCase().includes(this.specialityFilter.toLowerCase()));

    return inputMatch && specialityMatch;
  }

  passSurvey(survey: PatientSurveyInfo) {
    this.accessGuard.setAccess();
    this.router.navigate(['passing-survey', survey.id]);
  }

  isPatientSurveyMatch(survey: PatientSurveyInfo): boolean {
    const inputMatch = !this.inputFilter ||
      survey.title.toLowerCase().includes(this.inputFilter.toLowerCase());

    const specialityMatch = !this.specialityFilter ||
      (survey.speciality && survey.speciality.toLowerCase().includes(this.specialityFilter.toLowerCase()));

    return inputMatch && !!specialityMatch;
  }

  getCurrentDate(survey: PatientSurveyInfo): boolean {
    const currentDate = new Date();

    if (!survey.lastPassageDate) {
      return false; // lastPassageDate is null, return false
    } else {
      const lastPassageDate = new Date(survey.lastPassageDate); // Convert the string to a Date object
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const currentDay = currentDate.getDate();
      const lastPassageYear = lastPassageDate.getFullYear();
      const lastPassageMonth = lastPassageDate.getMonth();
      const lastPassageDay = lastPassageDate.getDate();

      return (
        lastPassageYear > currentYear ||
        (lastPassageYear === currentYear &&
          (lastPassageMonth > currentMonth || (lastPassageMonth === currentMonth && lastPassageDay >= currentDay)))
      );
    }
  }

  toggleSidenav() {
    this.hoverSidenav = true;
  }

  hideSidenav() {
    this.hoverSidenav = false;
  }

  logout() {
    this.authService.logout();
  }
}
