package io.server.backend.dto.mapper;

import io.server.backend.dto.response.QuestionResponse;
import io.server.backend.model.Answer;
import io.server.backend.model.Question;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionMapper implements Function<Question, QuestionResponse> {
    private final AnswerMapper answerMapper;

    @Override
    public QuestionResponse apply(Question question) {
        return new QuestionResponse(
                question.getId(),
                question.getQuestionText(),
                question.getQuestionType(),
                question.getOrder(),
                question.getInputMinLimit() == null ? null : question.getInputMinLimit(),
                question.getInputMaxLimit() == null ? null : question.getInputMaxLimit(),
                question.getAnswers()
                        .stream()
                        .sorted(Comparator.comparing(Answer::getOrder))
                        .map(answerMapper)
                        .collect(Collectors.toList())
        );
    }
}
