package io.server.backend.repository;

import io.server.backend.model.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findAllBySurveyId(Long surveyId);
}
