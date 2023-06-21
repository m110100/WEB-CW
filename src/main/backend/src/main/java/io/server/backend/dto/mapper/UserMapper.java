package io.server.backend.dto.mapper;

import io.server.backend.dto.response.UserResponse;
import io.server.backend.model.User;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class UserMapper implements Function<User, UserResponse> {

    @Override
    public UserResponse apply(User user) {
        return new UserResponse(
                user.getId(),
                user.getRole().getName().name()
        );
    }
}
