import { TestBed } from '@angular/core/testing';

import { AccessPassingSurveyGuard } from './access-passing-survey.guard';

describe('AccessPassingSurveyGuard', () => {
  let guard: AccessPassingSurveyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AccessPassingSurveyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
