package io.server.backend.dto.mapper;

import io.server.backend.dto.response.SpecialityResponse;
import io.server.backend.dto.response.SurveyInfoResponse;
import io.server.backend.model.Survey;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class SurveyMapper implements Function<Survey, SurveyInfoResponse> {
    @Override
    public SurveyInfoResponse apply(Survey survey) {
        return new SurveyInfoResponse(
                survey.getId(),
                survey.getTitle(),
                survey.getDescription(),
                survey.getIsRating(),
                survey.getIsPublic(),
                survey.getCreatedAt(),
                survey.getSpeciality() != null ? new SpecialityResponse(survey.getSpeciality().getName()) : null,
                survey.getUser().getId()
        );
    }
}
