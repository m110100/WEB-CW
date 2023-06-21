import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {Routes, RouterModule} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SignupComponent} from "./components/authorization/signup/signup.component";
import {LoginComponent} from "./components/authorization/login/login.component";
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {CreateSurveyComponent} from './components/survey/create-survey/create-survey.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {CdkDrag, CdkDragHandle, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  SurveyQuestionDialogComponent
} from './components/survey/dialogs/survey-question-dialog/survey-question-dialog.component';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTabsModule} from "@angular/material/tabs";
import {MatRadioModule} from "@angular/material/radio";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AuthInterceptor} from "./services/auth/auth.interceptor";
import {ConfirmEmailComponent} from './components/authorization/confirm-email/confirm-email.component';
import {AuthGuard} from "./guards/authorization/auth.guard";
import {MatTableModule} from "@angular/material/table";
import {ConfirmLoginComponent} from "./components/authorization/confirm-login/confirm-login.component";
import {MatSelectModule} from "@angular/material/select";
import { SurveysComponent } from './components/survey/surveys/surveys.component';
import {MatStepperModule} from "@angular/material/stepper";
import { SurveyRecommendationDialogComponent } from './components/survey/dialogs/survey-recommendation-dialog/survey-recommendation-dialog.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatMenuModule} from "@angular/material/menu";
import { PassingSurveyComponent } from './components/survey/passing-survey/passing-survey.component';
import { GivenRecommendationComponent } from './components/survey/dialogs/given-recommendation/given-recommendation.component';
import {UnsavedChangesGuard} from "./guards/unsavedChangesGuard";
import {AccessPassingSurveyGuard} from "./guards/access-passing-survey.guard";
import { ResultsComponent } from './components/survey/results/results.component';

const ROUTES: Routes = [
  {
    path: "",
    component: AppComponent
  },

  // Аутентификация пользователя
  {
    path: "auth",
    component: AppComponent,
    children: [
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
      {
        path: "confirm-login",
        canActivate: [AuthGuard],
        component: ConfirmLoginComponent
      },
      {
        path: "confirm-email",
        canActivate: [AuthGuard],
        component: ConfirmEmailComponent
      },
      {
        path: "login",
        component: LoginComponent
      },
    ]
  },

  {
    path: "dashboard",
    canActivate: [AuthGuard],
    component: DashboardComponent
  },

  {
    path: "surveys",
    component: SurveysComponent
  },
  {
    path: "create-survey",
    component: CreateSurveyComponent,
    canDeactivate: [UnsavedChangesGuard]
  },
  {
    path: "passing-survey/:id",
    component: PassingSurveyComponent,
    canActivate: [AccessPassingSurveyGuard],
    canDeactivate: [UnsavedChangesGuard]
  },
  {
    path: "results/survey/:surveyId/:patientId",
    component: ResultsComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    CreateSurveyComponent,
    DashboardComponent,
    SurveyQuestionDialogComponent,
    ConfirmEmailComponent,
    ConfirmLoginComponent,
    SurveysComponent,
    SurveyRecommendationDialogComponent,
    PassingSurveyComponent,
    GivenRecommendationComponent,
    ResultsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatGridListModule,
    MatNativeDateModule,
    MatRippleModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    FormsModule,
    MatDialogModule,
    MatToolbarModule,
    MatSidenavModule,
    MatTabsModule,
    MatRadioModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule,
    MatStepperModule,
    CdkDragHandle,
    MatTooltipModule,
    MatMenuModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
