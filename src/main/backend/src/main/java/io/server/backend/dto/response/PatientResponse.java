package io.server.backend.dto.response;

public record PatientResponse(
        Long id,
        String surname,
        String name,
        String patronymic
) { }
