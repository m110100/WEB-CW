package io.server.backend.dto.response;

import io.server.backend.model.enums.QuestionType;

import java.util.List;

public record QuestionResponse(
        Long id,
        String questionText,
        QuestionType questionType,
        Integer order,
        Integer inputMinLimit,
        Integer inputMaxLimit,
        List<AnswerResponse> answers
) { }
