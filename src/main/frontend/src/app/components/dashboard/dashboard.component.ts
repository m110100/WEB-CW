import {Component, OnInit} from '@angular/core';
import {PatientSurveyInfo, SurveyInfoResponse} from "../../models/dto/response/surveyInfoResponse";
import {SurveyService} from "../../services/survey.service";
import {AuthService} from "../../services/auth/auth.service";
import {User} from "../../models/user";
import {LatestSurveyResponse} from "../../models/dto/response/latestSurveyResponse";
import {
  AppointmentDoctorsResponse,
  AppointmentPatientsResponse
} from "../../models/dto/response/appointmentPatientsResponse";
import {AppointmentService} from "../../services/appointment.service";
import {SpecialityResponse} from "../../models/dto/response/specialityResponse";
import {SpecialityService} from "../../services/speciality.service";
import {Router} from "@angular/router";
import {AccessPassingSurveyGuard} from "../../guards/access-passing-survey.guard";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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

  user: User;
  surveys: SurveyInfoResponse[] = [];
  patientSurveys: PatientSurveyInfo[] = [];
  latestSurveys: LatestSurveyResponse[] = [];
  patients: AppointmentPatientsResponse[] = [];
  doctors: AppointmentDoctorsResponse[] = [];
  specialities: SpecialityResponse[] = [];
  surveyDisplayedColumns: string[] = ['title', 'isPublic', 'isRating', 'createdAt', 'actions'];
  patientSurveyDisplayedColumns: string[] = ['title', 'speciality', 'lastPassageDate', 'actions'];

  patientDisplayedColumns: string[] = ['surname', 'name', 'patronymic', 'appointmentDate'];
  doctorDisplayedColumns: string[] = ['surname', 'name', 'patronymic', 'speciality', 'appointmentDate'];

  inputFilter: string = '';
  specialityFilter: string = '';
  specialityDoctorFilter: string = '';
  patientSearchValue: string;
  doctorSearchValue: string;

  constructor(
    private router: Router,
    private accessGuard: AccessPassingSurveyGuard,
    private authService: AuthService,
    private surveyService: SurveyService,
    private specialityService: SpecialityService,
    private appointmentService: AppointmentService,
  ) {
  }

  ngOnInit() {
    this.user = this.authService.getUser();

    this.loadDoctorSurveys();
    this.loadDoctorLatestSurveys();
    this.loadDoctorAppointmentPatients();

    this.loadPatientSurveys();
    this.loadPatientAppointmentDoctors();

    this.loadSpecialities();
  }

  loadDoctorSurveys() {
    if (this.user.role === 'DOCTOR') {
      this.surveyService.getAllDoctorSurveys(this.user.id).subscribe((surveys: SurveyInfoResponse[]) => {
          this.surveys = surveys;
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

  loadDoctorLatestSurveys() {
    if (this.user.role === 'DOCTOR') {
      this.surveyService.getAllDoctorLatestSurveys(this.user.id)
        .subscribe((latestSurveys: LatestSurveyResponse[]) => {
            this.latestSurveys = latestSurveys;
          },
          error => {
            console.log(error);
          })
    }
  }

  loadDoctorAppointmentPatients() {
    if (this.user.role === 'DOCTOR') {
      this.appointmentService.getAllDoctorAppointmentPatients(this.user.id)
        .subscribe((patients: AppointmentPatientsResponse[]) => {
          this.patients = patients;
        },
          error => {
          console.log(error);
          })
    }
  }

  loadPatientAppointmentDoctors() {
    if (this.user.role === 'PATIENT') {
      this.appointmentService.getAllPatientAppointmentDoctors(this.user.id)
        .subscribe((doctors: AppointmentDoctorsResponse[]) => {
          this.doctors = doctors;
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
    const surveyIndex: number = this.surveys.indexOf(survey);
    const latestSurveyIndex: number = this.latestSurveys.findIndex((latestSurvey: LatestSurveyResponse) => {
      return latestSurvey.id === id;
    })

    this.surveyService.deleteSurvey(id).subscribe(() => {
      this.surveys.splice(surveyIndex, 1);
      this.latestSurveys.splice(latestSurveyIndex, 1);
    }, error => {
      console.log(error);
    })
  }

  passSurvey(survey: PatientSurveyInfo) {
    this.accessGuard.setAccess();
    this.router.navigate(['passing-survey', survey.id]);
  }

  isSurveyMatch(survey: SurveyInfoResponse): boolean {
    const inputMatch = !this.inputFilter ||
      survey.title.toLowerCase().includes(this.inputFilter.toLowerCase());

    const specialityMatch = !this.specialityFilter ||
      (survey.speciality && survey.speciality.name.toLowerCase().includes(this.specialityFilter.toLowerCase()));

    return inputMatch && specialityMatch;
  }

  isPatientSurveyMatch(survey: PatientSurveyInfo): boolean {
    const inputMatch = !this.inputFilter ||
      survey.title.toLowerCase().includes(this.inputFilter.toLowerCase());

    const specialityMatch = !this.specialityFilter ||
      (survey.speciality && survey.speciality.toLowerCase().includes(this.specialityFilter.toLowerCase()));

    return inputMatch && !!specialityMatch;
  }

  isPatientMatch(patient: AppointmentPatientsResponse): boolean {
    if (!this.patientSearchValue) {
      return true; // No search value, show all patients
    }

    const searchText = this.patientSearchValue.toLowerCase();
    const fullName = `${patient.surname} ${patient.name} ${patient.patronymic}`.toLowerCase();

    return fullName.includes(searchText);
  }

  isDoctorMatch(doctor: AppointmentDoctorsResponse): boolean {
    if (!this.doctorSearchValue && !this.specialityDoctorFilter) {
      return true; // No search value or specialty filter, show all doctors
    }

    const searchText = this.doctorSearchValue ? this.doctorSearchValue.toLowerCase() : '';
    const fullName = `${doctor.surname} ${doctor.name} ${doctor.patronymic}`.toLowerCase();

    const searchByFullName = fullName.includes(searchText);
    const searchBySpeciality = !this.specialityDoctorFilter || doctor.speciality.name === this.specialityDoctorFilter;

    return searchByFullName && searchBySpeciality;
  }

  changeWordEnding(num: number, word: string) {
    let ending: string;

    if (num === 0) {
      return 'Нет ответов'
    }

    if (num === 1 || (num % 10 === 1 && num !== 11)) {
      ending = '';
    } else if (
      (num === 2 || num === 3 || num === 4) ||
      (num % 10 === 2 && num !== 12) ||
      (num % 10 === 3 && num !== 13) ||
      (num % 10 === 4 && num !== 14)
    ) {
      ending = 'а';
    } else {
      ending = 'ов';
    }

    return `${num} ${word}${ending}`;
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
