package io.server.backend.dto.response;

public record RecommendationResponse(
        Long id,
        String recommendationText,
        Integer minScore,
        Integer maxScore
) { }
