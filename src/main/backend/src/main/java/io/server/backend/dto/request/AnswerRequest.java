package io.server.backend.dto.request;

public record AnswerRequest(
        String answerText,
        Integer score,
        Integer order
) { }
