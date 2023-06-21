import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GivenRecommendationComponent } from './given-recommendation.component';

describe('GivenRecommendationComponent', () => {
  let component: GivenRecommendationComponent;
  let fixture: ComponentFixture<GivenRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GivenRecommendationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GivenRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
