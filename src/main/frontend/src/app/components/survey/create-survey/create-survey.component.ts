import {Component, OnDestroy, OnInit} from '@angular/core';
import {QuestionType} from "../../../models/enums/questionType";
import {MatDialog} from "@angular/material/dialog";
import {SurveyQuestionDialogComponent} from "../dialogs/survey-question-dialog/survey-question-dialog.component";
import {LocalstorageService} from "../../../services/localstorage/localstorage.service";
import {SurveyService} from "../../../services/survey.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {interval, Observable, Subject, takeUntil} from "rxjs";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {QuestionRequest} from "../../../models/dto/request/questionRequest";
import {SurveyRequest} from "../../../models/dto/request/surveyRequest";
import {SpecialityResponse} from "../../../models/dto/response/specialityResponse";
import {SpecialityService} from "../../../services/speciality.service";
import {RecommendationRequest} from "../../../models/dto/request/recommendationRequest";
import {
  SurveyRecommendationDialogComponent
} from "../dialogs/survey-recommendation-dialog/survey-recommendation-dialog.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../models/user";
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {CanComponentDeactivate} from "../../../guards/unsavedChangesGuard";

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false}
    }
  ]
})
export class CreateSurveyComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  private destroy$ = new Subject<void>();

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

  specialities: SpecialityResponse[];
  recommendations: RecommendationRequest[] = [];
  recommendationForm: FormGroup;
  textAreaForm: FormGroup;

  errorMessage: string;

  user: User;
  survey: SurveyRequest;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private localStorageService: LocalstorageService,
    private surveyService: SurveyService,
    private authService: AuthService,
    private specialityService: SpecialityService
  ) {
    this.survey = {
      title: 'Новый опрос',
      description: '',
      isRating: false,
      isPublic: false,
      speciality: null,
      questions: [],
      recommendations: null,
      userId: 0
    };
    this.textAreaForm = new FormGroup({});
  }

  ngOnInit() {
    this.loadUser();
    this.loadSpecialities();

    this.recommendationForm = new FormGroup({
      recommendationText: new FormControl('', [Validators.required]),
      recommendationMinScore: new FormControl(0, [Validators.required, Validators.min(0)]),
      recommendationMaxScore: new FormControl(0, [Validators.required, Validators.min(0)])
    })

    this.errorMessage = '';

    this.loadDataFromLocalStorage();

    interval(5 * 10 * 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const surveyData = this.survey;
        this.autoSaveSurvey(surveyData);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    this.localStorageService.clearSurvey();
  }

  loadUser() {
    this.user = this.authService.getUser()
  }

  loadSpecialities() {
    this.specialityService.getAllSpecialities().subscribe((specialities: SpecialityResponse[]) => {
        this.specialities = specialities;
      },
      error => {
        console.log(error);
      })
  }

  onPublicAccessChange(value: boolean) {
    this.survey.isPublic = value;

    if (this.survey.isPublic && this.survey.speciality !== null) {
      this.survey.speciality = null;
    }
  }

  onRatingTypeChange(value: boolean) {
    this.survey.isRating = value;

    if (!this.survey.isRating) {
      this.updateAnswerScores();
    }
  }

  addQuestion(questionType: QuestionType) {
    const newQuestion: QuestionRequest = {
      questionText: 'Новый вопрос',
      questionType: questionType,
      order: this.survey.questions.length + 1,
      inputMinLimit: questionType === QuestionType.TEXT ? 0 : null,
      inputMaxLimit: questionType === QuestionType.TEXT ? 100 : null,
      answers: []
    };

    this.survey.questions.push(newQuestion);

    if (newQuestion.questionType !== QuestionType.TEXT) {
      this.addAnswer(newQuestion);
    }

    this.editQuestion(newQuestion);
  }

  editQuestion(question: QuestionRequest) {
    const dialogRef = this.dialog.open(SurveyQuestionDialogComponent, {
      data: { question, isRating: this.survey.isRating },
      disableClose: true,
      width: '600px',
      height: '700px',
      maxHeight: '100%'
    });

    dialogRef.afterClosed().subscribe((updatedQuestion: QuestionRequest) => {
      const index = this.survey.questions.findIndex(q => q === question);
      if (index !== -1) {
        this.survey.questions[index] = updatedQuestion;
      }
    });
  }

  removeQuestion(question: QuestionRequest) {
    const index = this.survey.questions.indexOf(question);
    if (index !== -1) {
      this.survey.questions.splice(index, 1);
    }
  }

  addAnswer(question: QuestionRequest) {
    question.answers.push(
      {
        answerText: 'Вариант ответа',
        score: this.survey.isRating ? 0 : null,
        order: question.answers.length + 1
      }
    );
  }

  addRecommendation() {
    if (this.recommendationForm.invalid) {
      return;
    }

    const newRecommendation: RecommendationRequest = {
      recommendationText: this.recommendationForm.value.recommendationText,
      minScore: this.recommendationForm.value.recommendationMinScore,
      maxScore: this.recommendationForm.value.recommendationMaxScore
    };

    this.recommendations.push(newRecommendation);

    this.recommendationForm.reset();
  }

  editRecommendation(recommendation: RecommendationRequest) {
    const dialogRef = this.dialog.open(SurveyRecommendationDialogComponent, {
      data: recommendation,
      disableClose: true,
      width: '600px',
      height: '700px',
      maxHeight: '100%'
    });

    dialogRef.afterClosed().subscribe((updatedRecommendation: RecommendationRequest) => {
      const index = this.recommendations.findIndex(r => r === recommendation);
      if (index !== -1) {
        this.recommendations[index] = updatedRecommendation;
      }
    });
  }

  deleteRecommendation(recommendation: RecommendationRequest) {
    const index = this.recommendations.indexOf(recommendation);
    if (index !== -1) {
      this.recommendations.splice(index, 1);
    }
  }

  updateAnswerScores() {
    if (this.survey.isRating) {
      // Если isRating = true, установите значения score, которые равны null, на 0
      this.survey.questions.forEach(question => {
        question.answers.forEach(answer => {
          if (answer.score === null) {
            answer.score = 0;
          }
        });
      });
    } else {
      // Если isRating = false, установите все значения score в null
      this.survey.questions.forEach(question => {
        question.answers.forEach(answer => {
          answer.score = null;
        });
      });
    }
  }

  onQuestionDropped(event: CdkDragDrop<any[]>): void {
    const movedQuestion = this.survey.questions[event.previousIndex];
    this.survey.questions.splice(event.previousIndex, 1);
    this.survey.questions.splice(event.currentIndex, 0, movedQuestion);

    // Обновляем поле order в каждом вопросе
    this.survey.questions.forEach((question, index) => {
      question.order = index;
    });
  }

  textareaControls: FormControl[] = [];

  getTextareaControl(question: QuestionRequest, index: number): FormControl {
    if (!this.textareaControls[index]) {
      this.textareaControls[index] = new FormControl('', [
        Validators.minLength(question.inputMinLimit!),
        Validators.maxLength(question.inputMaxLimit!),
      ]);
    }

    return this.textareaControls[index];
  }

  getRemainingCharacters(question: QuestionRequest, index: number): string {
    const textareaControl = this.textareaControls[index];
    const enteredChars = textareaControl?.value?.length || 0;
    const remainingChars = Math.max(question.inputMaxLimit! - enteredChars, 0);
    const usedChars = question.inputMaxLimit! - remainingChars;
    return `${usedChars}/${question.inputMaxLimit}`;
  }

  autoSaveSurvey(survey: SurveyRequest) {
    this.localStorageService.saveSurvey(survey);

    this.snackBar.open("Данные сохранены", "ОК", {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['white-snackbar'],
      duration: 1000
    });
  }

  loadDataFromLocalStorage() {
    let loadedSurvey: SurveyRequest = this.localStorageService.getSurvey();

    if (loadedSurvey !== null && this.survey !== loadedSurvey) {
      this.survey = loadedSurvey;
    }
  }

  saveSurvey() {
    this.survey.userId = this.user.id;

    if (!this.survey.isRating && this.survey.recommendations !== null) {
      this.survey.recommendations = null;
    }

    if (this.survey.isRating && this.recommendations.length == 0) {
      this.errorMessage = 'Невозможно создать опрос!\n' +
        'Ваш опрос является со шкалой оценки, но при этом не содержит ни одной рекомендации!'
      return;
    }

    if (this.survey.isRating && this.recommendations.length !== 0) {
      this.survey.recommendations = this.recommendations;
    }

    if (!this.survey.isPublic && this.survey.speciality == null) {
      this.errorMessage = 'Невозможно создать опрос!\n' +
        'Ваш опрос доступен только пациентам, которые записались ' +
        'ко врачу с определенной специальностью, но вы не выбрали специальность врача!'
      return;
    }

    if (this.survey.questions.length === 0) {
      this.errorMessage = 'Невозможно создать опрос!\n' +
        'У вашего опроса нет ни одного вопроса'
      return;
    }

    if (this.survey.title.trim().length === 0) {
      this.errorMessage = 'Невозможно создать опрос, так как у него нет названия!'
      return;
    }

    // Избавляемся от пустых пробелов с начала и конца
    this.survey.title = this.survey.title.trim();

    for (let i = 0; i < this.survey.questions.length; i++) {
      this.survey.questions[i].questionText = this.survey.questions[i].questionText.trim();
      for (let j = 0; j < this.survey.questions[i].answers.length; j++) {
        this.survey.questions[i].answers[j].answerText = this.survey.questions[i].answers[j].answerText.trim();
      }
    }

    this.surveyService.createSurvey(this.survey).subscribe((survey: SurveyRequest) => {
      this.localStorageService.clearSurvey();
      this.router.navigate(['/dashboard']);
    }, error => {
      console.log(error);
    });
  }

  getQuestionIcon(questionType: QuestionType): string {
    // Map question type to the corresponding material icon
    switch (questionType) {
      case QuestionType.TEXT:
        return 'notes';
      case QuestionType.MULTIPLE:
        return 'check_box';
      case QuestionType.SINGLE:
        return 'radio_button_checked';
      default:
        return '';
    }
  }

  getAnswerIcon(questionType: QuestionType): string {
    switch (questionType) {
      case QuestionType.TEXT:
        return 'notes';
      case QuestionType.MULTIPLE:
        return 'check_box_outline_blank';
      case QuestionType.SINGLE:
        return 'radio_button_unchecked';
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

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return confirm('Вы хотите покинуть страницу? Все несохраненные изменения будут потеряны.');
  }

  protected readonly QuestionType = QuestionType;
}
