package io.server.backend.dto.request;

import io.server.backend.dto.response.SpecialityResponse;

import java.util.List;

public record SurveyRequest(
        String title,
        String description,
        Boolean isRating,
        Boolean isPublic,
        SpecialityResponse speciality,
        List<QuestionRequest> questions,
        List<RecommendationRequest> recommendations,

        Long userId
) { }
