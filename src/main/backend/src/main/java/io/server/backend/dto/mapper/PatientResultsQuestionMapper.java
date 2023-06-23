package io.server.backend.dto.mapper;

import io.server.backend.dto.response.PatientResultsQuestionResponse;
import io.server.backend.model.Question;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class PatientResultsQuestionMapper implements Function<Question, PatientResultsQuestionResponse> {
    @Override
    public PatientResultsQuestionResponse apply(Question question) {
        return new PatientResultsQuestionResponse(
                question.getId(),
                question.getQuestionText(),
                question.getQuestionType()
        );
    }
}
