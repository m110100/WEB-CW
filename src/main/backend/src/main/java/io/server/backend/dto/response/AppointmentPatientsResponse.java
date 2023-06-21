package io.server.backend.dto.response;

import java.time.LocalDateTime;

public record AppointmentPatientsResponse(
    Long patientId,
    String surname,
    String name,
    String patronymic,
    LocalDateTime appointmentDate
) { }
