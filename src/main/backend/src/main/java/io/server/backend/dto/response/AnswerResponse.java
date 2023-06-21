package io.server.backend.dto.response;

public record AnswerResponse(
        Long id,
        String answerText,
        Integer score,
        Integer order
) { }
