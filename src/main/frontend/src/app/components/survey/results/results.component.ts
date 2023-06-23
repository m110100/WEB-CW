import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SurveyService} from "../../../services/survey.service";
import {PatientResultsResponse} from "../../../models/dto/response/patientResultsResponse";
import {SurveyInfoResponse} from "../../../models/dto/response/surveyInfoResponse";
import {AuthService} from "../../../services/auth/auth.service";
import {User} from "../../../models/user";
import {PatientResponse} from "../../../models/dto/response/patientResponse";
import {FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {PatientResultsQuestionResponse} from "../../../models/dto/response/patientResultsQuestionResponse";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
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

  survey: SurveyInfoResponse;
  results: PatientResultsResponse[] = [];

  patients: PatientResponse[];

  patientControl = new FormControl('');
  filteredPatients: Observable<PatientResponse[]>;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private surveyService: SurveyService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();

    this.route.params.subscribe(params => {
      const surveyId = params['surveyId'];
      // const patientId = params['patientId'];

      // Если передан ID опроса
      if (surveyId) {
        this.surveyService.getSurvey(surveyId).subscribe((survey: SurveyInfoResponse) => {
          this.survey = survey;

          // Проверяем, если опрос принадлежит текущему доктору, то загружаем всех пациентов, которые прошли его опрос,
          // независимо от того, записаны ли они к нему на прием
          if (this.survey.creatorId === this.user.id && this.user.role === 'DOCTOR') {
            this.surveyService.getPatientsWhichCompleteDoctorSurvey(this.user.id, surveyId)
              .subscribe((patients: PatientResponse[]) => {
                this.patients = patients;

                if (this.patients) {
                  this.filteredPatients = this.patientControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || ''))
                  );
                }
            }, error => {
                console.log(error);
              })
          } else {
            // Если опрос не принадлежит доктору, то загружаем всех пациентов, которые записаны к нему на прием и
            // у них есть результаты по текущему опросу
            this.surveyService.getPatientsWhichHaveDoctorAppointmentAndCompleteSurvey(this.user.id, surveyId)
              .subscribe((patients: PatientResponse[]) => {
                this.patients = patients;

                if (this.patients) {
                  this.filteredPatients = this.patientControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || ''))
                  );
                }
              }, error => {
                console.log(error);
              })
          }
        }, error => {
          console.log(error);
        })

        // Сразу загружаем результаты если это пациент и у него есть результаты
        if (this.user.role === 'PATIENT') {
          this.surveyService.getPatientResults(this.user.id, surveyId)
            .subscribe((results: PatientResultsResponse[]) => {
              this.results = results;
              console.log(this.results);
            }, error =>  {
              console.log(error);
            });
        }
      }
    })
  }

  getPatientResults(patient: PatientResponse, surveyId: number) {
    // Если пациент выбран и существует, то загружаем результаты его прохождения
    if (patient) {
      const patientId = patient.id

      const fullName = `${patient.surname} ${patient.name} ${patient.patronymic}`;
      this.patientControl.setValue(fullName);

      this.surveyService.getPatientResults(patientId, surveyId)
        .subscribe((results: PatientResultsResponse[]) => {
          this.results = results;
          console.log(this.results);
        }, error =>  {
          console.log(error);
        });
    } else {
      // Если пациент не выбран или не существует, то обнуляем список результатов
      this.results = [];
      return;
    }
  }

  private _filter(value: string): PatientResponse[] {
    const filterValue = value ? value.toLowerCase() : '';

    return this.patients.filter(patient => {
      const fullName = `${patient.surname} ${patient.name} ${patient.patronymic}`;
      return fullName.toLowerCase().includes(filterValue);
    });
  }

  getUniqueQuestions(results: any[]): any[] {
    const uniqueQuestions: PatientResultsQuestionResponse[] = [];
    const questionIds: number[] = [];

    results.forEach((result) => {
      const questionId = result.question.id;
      if (!questionIds.includes(questionId)) {
        questionIds.push(questionId);
        uniqueQuestions.push(result);
      }
    });

    return uniqueQuestions;
  }

  getAnswersForQuestion(results: any[], questionId: number): any[] {
    return results.filter((result) => result.question.id === questionId);
  }

  getAnswerIcon(questionType: string): string {
    switch (questionType) {
      case 'TEXT':
        return 'notes';
      case 'MULTIPLE':
        return 'check_box';
      case 'SINGLE':
        return 'radio_button_checked';
      default:
        return '';
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

