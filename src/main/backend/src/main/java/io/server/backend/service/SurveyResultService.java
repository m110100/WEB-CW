package io.server.backend.service;

import io.server.backend.model.SurveyResult;
import io.server.backend.repository.SurveyResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SurveyResultService {
    private final SurveyResultRepository surveyResultRepository;

    public SurveyResult saveSurveyResult(SurveyResult surveyResult) {
        return surveyResultRepository.save(surveyResult);
    }
}
