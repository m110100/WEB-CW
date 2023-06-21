package io.server.backend.dto.request;

public record UserRequest(
    String surname,
    String name,
    String patronymic,
    String insurancePolicy,
    String email,
    String password
) { }
