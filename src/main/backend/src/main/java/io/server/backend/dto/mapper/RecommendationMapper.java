package io.server.backend.dto.mapper;

import io.server.backend.dto.response.RecommendationResponse;
import io.server.backend.model.Recommendation;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class RecommendationMapper implements Function<Recommendation, RecommendationResponse> {
    @Override
    public RecommendationResponse apply(Recommendation recommendation) {
        return new RecommendationResponse(
                recommendation.getId(),
                recommendation.getRecommendationText(),
                recommendation.getMinScore(),
                recommendation.getMaxScore()
        );
    }
}
