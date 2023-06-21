package io.server.backend.service;

import io.server.backend.dto.mapper.AnswerMapper;
import io.server.backend.dto.response.AnswerResponse;
import io.server.backend.model.Answer;
import io.server.backend.repository.AnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnswerService {
    private final AnswerRepository answerRepository;

    private final AnswerMapper answerMapper;

    public List<AnswerResponse> findAllAnswers() {
        return answerRepository.findAll()
                .stream()
                .map(answerMapper)
                .collect(Collectors.toList());
    }

    public List<AnswerResponse> getAllAnswersByQuestionId(Long questionId) {
        return answerRepository.findAnswersByQuestionIdOrderByOrderAsc(questionId)
                .stream()
                .map(answerMapper)
                .collect(Collectors.toList());
    }

    public AnswerResponse getAnswerById(Long id) {
        return answerRepository.findById(id)
                .map(answerMapper)
                .orElseThrow(() -> new RuntimeException(
                   "Answer with id [%s] not found".formatted(id)
                ));
    }

    public Answer saveAnswer(Answer answer) {
        return answerRepository.save(answer);
    }
}
