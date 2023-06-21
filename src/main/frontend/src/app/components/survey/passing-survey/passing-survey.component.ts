import {Component, OnInit} from '@angular/core';
import {SurveyInfoResponse} from "../../../models/dto/response/surveyInfoResponse";
import {QuestionResponse} from "../../../models/dto/response/questionResponse";
import {SurveyService} from "../../../services/survey.service";
import {AuthService} from "../../../services/auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RecommendationResponse} from "../../../models/dto/response/recommendationResponse";
import {SurveyCompleteRequest} from "../../../models/dto/request/surveyCompleteRequest";
import {User} from "../../../models/user";
import {MatDialog} from "@angular/material/dialog";
import {GivenRecommendationComponent} from "../dialogs/given-recommendation/given-recommendation.component";
import {CanComponentDeactivate} from "../../../guards/unsavedChangesGuard";
import {Observable} from "rxjs";
import {AccessPassingSurveyGuard} from "../../../guards/access-passing-survey.guard";

@Component({
  selector: 'app-passing-survey',
  templateUrl: './passing-survey.component.html',
  styleUrls: ['./passing-survey.component.scss']
})
export class PassingSurveyComponent implements OnInit, CanComponentDeactivate {
  errorMessage: string;

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
  questions: QuestionResponse[];
  recommendations: RecommendationResponse[];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private surveyService: SurveyService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.errorMessage = '';

    this.route.paramMap.subscribe(params => {
      const surveyId = +params.get('id')!;
      if (surveyId) {
        this.user = this.authService.getUser();
        this.surveyService.getSurvey(surveyId).subscribe((survey: SurveyInfoResponse) => {
          if (survey) {
            this.survey = survey;
            this.surveyService.getAllSurveyQuestions(this.survey.id)
              .subscribe((questions: QuestionResponse[]) => {
                this.questions = questions;
              })
          }

          if (survey.isRating) {
            this.surveyService.getAllSurveyRecommendations(this.survey.id)
              .subscribe((recommendations: RecommendationResponse[]) => {
                this.recommendations = recommendations;
              })
          }
        })
      }
    })
  }

  // У меня просто не работает ни одно из моих реализаций с использование FormGroup, поэтому до связи
  selectedSingleAnswers: { [questionId: number]: { answerText: string, score: number | null } } = {};
  selectedMultipleAnswers: { [questionId: number]: { answerText: string, score: number | null }[] } = {};
  textInputAnswers: { [questionId: number]: string } = {};

  handleSingleResponses() {
    const givenSingleResponses: { [questionId: number]: { answerText: string, score: number | null } } = {};
    for (const question of this.questions) {
      if (question.questionType.toString() === 'SINGLE') {
        const selectedAnswer = this.selectedSingleAnswers[question.id];
        if (selectedAnswer !== undefined && selectedAnswer !== null) {
          givenSingleResponses[question.id] = selectedAnswer;
        } else {
          return;
        }
      }
    }

    return givenSingleResponses;
  }

  handleMultipleResponses() {
    const givenMultipleResponses: { [questionId: number]: { answerText: string, score: number | null }[] } = {};

    for (const question of this.questions) {
      if (question.questionType.toString() === 'MULTIPLE') {
        const selectedAnswers = question.answers.filter((answer) => this.selectedMultipleAnswers[answer.id]);
        if (selectedAnswers.length > 0) {
          givenMultipleResponses[question.id] = selectedAnswers.map((answer) => {
            return {
              answerText: answer.answerText,
              score: answer.score
            };
          });
        } else {
          return;
        }
      }
    }

    return givenMultipleResponses;
  }

  handleTextResponses() {
    const givenTextResponses: { [questionId: number]: string } = {};

    for (const question of this.questions) {
      if (question.questionType.toString() === 'TEXT') {
        const answer = this.textInputAnswers[question.id];
        const minLength = this.getQuestionMinLength(question);
        const maxLength = this.getQuestionMaxLength(question);

        if (answer.length < minLength || answer.length > maxLength) {
          return;
        }

        givenTextResponses[question.id] = this.textInputAnswers[question.id];
      }
    }

    return givenTextResponses;
  }

  submitForm() {
    const givenSingleResponses = this.handleSingleResponses();
    const givenMultipleResponses = this.handleMultipleResponses();
    const givenTextResponses = this.handleTextResponses();

    let userResults: SurveyCompleteRequest[] = [];

    // Если опрос с шкалой оценки
    if (this.recommendations) {
      // Количество баллов
      let totalScore: number = 0;

      // Считаем баллы - если вопросы с одиночным ответом существуют и у них есть балл
      if (givenSingleResponses !== undefined) {
        for (const questionId in givenSingleResponses) {
          const answer = givenSingleResponses[questionId];

          if (answer.score !== null) {
            totalScore+=answer.score;
          }
        }
      }

      // Считаем баллы - если вопросы с множественным ответом существуют и у них есть балл
      if (givenMultipleResponses !== undefined) {
        for (const questionId in givenMultipleResponses) {
          const answers = givenMultipleResponses[questionId];

          for (const answer of answers) {
            if (answer.score !== null) {
              totalScore+=answer.score;
            }
          }
        }
      }

      // Ищем рекомендацию
      const matchedRecommendation = this.findMatchedRecommendation(totalScore);

      // Формируем ответы пользователя и отправляем на сервер
      if (givenSingleResponses !== undefined && matchedRecommendation !== null) {
        for (const questionId in givenSingleResponses) {
          const question = this.getQuestionById(questionId);
          const answer = givenSingleResponses[questionId];
          userResults.push({
            question: question,
            givenAnswer: answer.answerText,
            recommendation: matchedRecommendation,
            survey: this.survey,
            userId: this.user.id
          });
        }
      }
      if (givenMultipleResponses !== undefined && matchedRecommendation !== null) {
        for (const questionId in givenMultipleResponses) {
          const question = this.getQuestionById(questionId);
          const answers = givenMultipleResponses[questionId];
          for (const answer of answers) {
            userResults.push({
              question: question,
              givenAnswer: answer.answerText,
              recommendation: matchedRecommendation,
              survey: this.survey,
              userId: this.user.id
            });
          }
        }
      }
      if (givenTextResponses !== undefined && matchedRecommendation !== null) {
        for (const questionId in givenTextResponses) {
          const question = this.getQuestionById(questionId);
          const answer = givenTextResponses[questionId];
          userResults.push({
            question: question,
            givenAnswer: answer,
            recommendation: matchedRecommendation,
            survey: this.survey,
            userId: this.user.id
          });
        }
      }


      if (userResults.length !== 0) {
        this.surveyService.publishSurveyResults(userResults).subscribe(() => {
          if (matchedRecommendation !== null) {
            const dialogRef = this.dialog.open(GivenRecommendationComponent, {
              data: matchedRecommendation.recommendationText,
              disableClose: true,
              width: '600px',
              height: 'auto',
              maxHeight: '100%'
            });

            dialogRef.afterClosed().subscribe(() => {
              this.router.navigate(['/dashboard']);
            })
          } else {
            this.router.navigate(['/dashboard']);
          }

        }, error => {
          console.log(error);
        });
      }

    } else {
      // Формируем ответы пользователя и отправляем на сервер
      if (givenSingleResponses !== undefined) {
        for (const questionId in givenSingleResponses) {
          const question = this.getQuestionById(questionId);
          const answer = givenSingleResponses[questionId];
          userResults.push({
            question: question,
            givenAnswer: answer.answerText,
            recommendation: null,
            survey: this.survey,
            userId: this.user.id
          });
        }
      }
      if (givenMultipleResponses !== undefined) {
        for (const questionId in givenMultipleResponses) {
          const question = this.getQuestionById(questionId);
          const answers = givenMultipleResponses[questionId];
          for (const answer of answers) {
            userResults.push({
              question: question,
              givenAnswer: answer.answerText,
              recommendation: null,
              survey: this.survey,
              userId: this.user.id
            });
          }
        }
      }
      if (givenTextResponses !== undefined) {
        for (const questionId in givenTextResponses) {
          const question = this.getQuestionById(questionId);
          const answer = givenTextResponses[questionId];
          userResults.push({
            question: question,
            givenAnswer: answer,
            recommendation: null,
            survey: this.survey,
            userId: this.user.id
          });
        }
      }

      if (userResults.length !== 0) {
        this.surveyService.publishSurveyResults(userResults).subscribe(() => {
          this.router.navigate(['/dashboard']);
        }, error => {
          console.log(error);
        });
      }
    }
  }

  findMatchedRecommendation(totalScore: number) {
    let matchedRecommendation: RecommendationResponse | null = null;

    for (const recommendation of this.recommendations) {
      if (totalScore >= recommendation.minScore && totalScore <= recommendation.maxScore) {
        matchedRecommendation = recommendation;
        break;
      }
    }

    return matchedRecommendation;
  }

  getQuestionById(id: string): QuestionResponse {
    return this.questions.find((question) => question.id.toString() === id)!;
  }

  getQuestionMinLength(question: QuestionResponse): number {
    return question.inputMinLimit ?? 0;
  }

  getQuestionMaxLength(question: QuestionResponse): number {
    return question.inputMaxLimit ?? Number.MAX_VALUE;
  }

  getRemainingCharacters(question: QuestionResponse): string {
    const textAnswer = this.textInputAnswers[question.id] || '';
    const maxLength = question.inputMaxLimit || Infinity;
    const remainingChars = textAnswer.length;
    return `${remainingChars}/${maxLength}`;
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
    return confirm('Вы хотите покинуть страницу? Все несохраненные данные будут потеряны.');
  }
}
