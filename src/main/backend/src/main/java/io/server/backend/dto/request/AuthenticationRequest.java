package io.server.backend.dto.request;

public record AuthenticationRequest(
        String email,
        String password
) { }
