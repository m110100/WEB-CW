package io.server.backend.dto.response;

import io.server.backend.model.enums.QuestionType;

public record PatientResultsQuestionResponse(
        Long id,
        String questionText,
        QuestionType questionType
) {
}
