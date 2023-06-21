package io.server.backend.dto.request;

public record RecommendationRequest(
        String recommendationText,
        Integer minScore,
        Integer maxScore
) { }
