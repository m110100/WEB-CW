package io.server.backend.dto.request;

import io.server.backend.dto.response.QuestionResponse;
import io.server.backend.dto.response.RecommendationResponse;
import io.server.backend.dto.response.SurveyInfoResponse;

public record CompleteSurveyRequest(
        QuestionResponse question,
        String givenAnswer,
        RecommendationResponse recommendation,
        SurveyInfoResponse survey,
        Long userId
) { }
