package io.server.backend.dto.response;

import io.server.backend.model.enums.QuestionType;

public record PatientResultsQuestionResponse(
        String questionText,
        QuestionType questionType
) {
}
