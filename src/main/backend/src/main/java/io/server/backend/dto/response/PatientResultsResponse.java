package io.server.backend.dto.response;

public record PatientResultsResponse(
        String givenRecommendation,
        PatientResultsQuestionResponse question,
        String giveAnswer
) {
}
