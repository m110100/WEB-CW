package io.server.backend.dto.mapper;

import io.server.backend.dto.response.AnswerResponse;
import io.server.backend.model.Answer;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class AnswerMapper implements Function<Answer, AnswerResponse> {
    @Override
    public AnswerResponse apply(Answer answer) {
        return new AnswerResponse(
                answer.getId(),
                answer.getAnswerText(),
                answer.getScore(),
                answer.getOrder()
        );
    }
}
