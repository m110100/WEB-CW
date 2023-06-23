package io.server.backend.repository;

import io.server.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findQuestionsBySurveyIdOrderByOrderAsc(Long surveyId);

    @Query("SELECT q FROM Question q WHERE q.isTemplate = true")
    List<Question> findTemplateQuestions();
}
