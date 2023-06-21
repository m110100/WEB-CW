import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassingSurveyComponent } from './passing-survey.component';

describe('PassingSurveyComponent', () => {
  let component: PassingSurveyComponent;
  let fixture: ComponentFixture<PassingSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassingSurveyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassingSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
