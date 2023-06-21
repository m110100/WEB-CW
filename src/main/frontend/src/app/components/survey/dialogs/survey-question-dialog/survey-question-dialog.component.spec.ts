import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyQuestionDialogComponent } from './survey-question-dialog.component';

describe('SurveyQuestionDialogComponent', () => {
  let component: SurveyQuestionDialogComponent;
  let fixture: ComponentFixture<SurveyQuestionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyQuestionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyQuestionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
