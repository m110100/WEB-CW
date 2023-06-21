package io.server.backend.dto.request;

public record EmailConfirmTokenRequest(
        String token
) { }
