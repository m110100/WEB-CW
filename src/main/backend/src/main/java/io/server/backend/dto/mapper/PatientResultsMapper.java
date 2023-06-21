package io.server.backend.dto.mapper;

import io.server.backend.dto.response.PatientResults;
import io.server.backend.dto.response.PatientResultsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class PatientResultsMapper implements Function<PatientResults, PatientResultsResponse> {
    private final PatientResultsQuestionMapper mapper;

    @Override
    public PatientResultsResponse apply(PatientResults patientResults) {
        return new PatientResultsResponse(
                patientResults.getGivenRecommendation(),
                mapper.apply(patientResults.getQuestion()),
                patientResults.getGivenAnswer()
        );
    }
}
