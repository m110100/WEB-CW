package io.server.backend.service;

import io.server.backend.dto.mapper.QuestionMapper;
import io.server.backend.dto.response.QuestionResponse;
import io.server.backend.model.Question;
import io.server.backend.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;

    private final QuestionMapper questionMapper;

    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll()
                .stream()
                .map(questionMapper)
                .collect(Collectors.toList());
    }

    public List<QuestionResponse> getAllQuestionsBySurveyId(Long surveyId) {
        return questionRepository.findQuestionsBySurveyIdOrderByOrderAsc(surveyId)
                .stream()
                .map(questionMapper)
                .collect(Collectors.toList());
    }

    public List<QuestionResponse> getAllQuestionsWithAnswers(Long surveyId) {
        return questionRepository.findQuestionsBySurveyIdOrderByOrderAsc(surveyId)
                .stream()
                .map(questionMapper)
                .collect(Collectors.toList());
    }

    public QuestionResponse getQuestionById(Long id) {
        return questionRepository.findById(id)
                .map(questionMapper)
                .orElseThrow(() -> new RuntimeException(
                   "Question with [%s] not found".formatted(id)
                ));
    }

    public Question getQuestionModelById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Question with id %s not found".formatted(id)
                ));
    }

    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }
}
