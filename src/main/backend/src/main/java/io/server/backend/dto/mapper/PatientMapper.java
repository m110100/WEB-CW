package io.server.backend.dto.mapper;

import io.server.backend.dto.response.PatientResponse;
import io.server.backend.model.User;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class PatientMapper implements Function<User, PatientResponse> {

    @Override
    public PatientResponse apply(User user) {
        return new PatientResponse(
                user.getId(),
                user.getSurname(),
                user.getName(),
                user.getPatronymic()
        );
    }
}
