package io.server.backend.dto.response;

import java.time.LocalDateTime;

public record AppointmentDoctorsResponse(
        Long doctorId,
        String surname,
        String name,
        String patronymic,
        SpecialityResponse speciality,
        LocalDateTime appointmentDate
) {
}
