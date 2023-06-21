package io.server.backend.dto.response;

import java.time.LocalDateTime;

public record SurveyInfoResponse(
        Long id,
        String title,
        String description,
        Boolean isRating,
        Boolean isPublic,
        LocalDateTime createdAt,
        SpecialityResponse speciality
) { }
