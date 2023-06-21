package io.server.backend.dto.mapper;

import io.server.backend.dto.response.AppointmentPatientsResponse;
import io.server.backend.model.Appointment;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class AppointmentPatientsMapper implements Function<Appointment, AppointmentPatientsResponse> {
    @Override
    public AppointmentPatientsResponse apply(Appointment appointment) {
        return new AppointmentPatientsResponse(
                appointment.getPatient().getId(),
                appointment.getPatient().getSurname(),
                appointment.getPatient().getName(),
                appointment.getPatient().getPatronymic(),
                appointment.getAppointmentDate()
        );
    }
}
