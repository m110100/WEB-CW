package io.server.backend.dto.mapper;

import io.server.backend.dto.response.SpecialityResponse;
import io.server.backend.model.Speciality;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class SpecialityMapper implements Function<Speciality, SpecialityResponse> {

    @Override
    public SpecialityResponse apply(Speciality speciality) {
        return new SpecialityResponse(speciality.getName());
    }
}
