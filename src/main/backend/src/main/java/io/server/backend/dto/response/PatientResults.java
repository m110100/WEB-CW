package io.server.backend.dto.response;

import io.server.backend.model.Question;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatientResults {
    private String givenRecommendation;
    private Question question;
    private String givenAnswer;

    public PatientResults(String givenRecommendation, Question question, String givenAnswer) {
        this.givenRecommendation = givenRecommendation;
        this.question = question;
        this.givenAnswer = givenAnswer;
    }
}
