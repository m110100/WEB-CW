package io.server.backend.service;

import io.server.backend.dto.mapper.RecommendationMapper;
import io.server.backend.dto.response.RecommendationResponse;
import io.server.backend.model.Recommendation;
import io.server.backend.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final RecommendationRepository recommendationRepository;
    private final RecommendationMapper recommendationMapper;

    public Recommendation saveRecommendation(Recommendation recommendation) {
        return recommendationRepository.save(recommendation);
    }

    public List<RecommendationResponse> getAllRecommendationsBySurveyId(Long surveyId) {
        return recommendationRepository.findAllBySurveyId(surveyId)
                .stream()
                .map(recommendationMapper)
                .collect(Collectors.toList());
    }

    public Recommendation getRecommendationById(Long id) {
        return recommendationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Recommendation with id %s not found".formatted(id)
                ));
    }
}
