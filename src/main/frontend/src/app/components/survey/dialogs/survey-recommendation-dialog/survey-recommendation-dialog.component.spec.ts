import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyRecommendationDialogComponent } from './survey-recommendation-dialog.component';

describe('SurveyRecommendationDialogComponent', () => {
  let component: SurveyRecommendationDialogComponent;
  let fixture: ComponentFixture<SurveyRecommendationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyRecommendationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyRecommendationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
