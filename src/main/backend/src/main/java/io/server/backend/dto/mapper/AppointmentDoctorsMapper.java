package io.server.backend.dto.mapper;

import io.server.backend.dto.response.AppointmentDoctorsResponse;
import io.server.backend.model.Appointment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class AppointmentDoctorsMapper implements Function<Appointment, AppointmentDoctorsResponse> {
    private final SpecialityMapper specialityMapper;

    @Override
    public AppointmentDoctorsResponse apply(Appointment appointment) {
        return new AppointmentDoctorsResponse(
                appointment.getDoctor().getId(),
                appointment.getDoctor().getSurname(),
                appointment.getDoctor().getName(),
                appointment.getDoctor().getPatronymic(),
                specialityMapper.apply(appointment.getDoctor().getSpeciality()),
                appointment.getAppointmentDate()
        );
    }
}
