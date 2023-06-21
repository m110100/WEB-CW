package io.server.backend.dto.request;

import io.server.backend.model.enums.QuestionType;

import java.util.List;

public record QuestionRequest(
        String questionText,
        QuestionType questionType,
        Integer order,
        Integer inputMinLimit,
        Integer inputMaxLimit,
        List<AnswerRequest> answers
) { }
