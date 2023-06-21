package io.server.backend.dto.response;

public record UserResponse(
        Long userId,
        String role
) {
}
