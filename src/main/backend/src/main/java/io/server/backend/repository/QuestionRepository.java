package io.server.backend.repository;

import io.server.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findQuestionsBySurveyIdOrderByOrderAsc(Long surveyId);
}
