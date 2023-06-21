package io.server.backend.service;

import io.server.backend.dto.mapper.AppointmentDoctorsMapper;
import io.server.backend.dto.mapper.AppointmentPatientsMapper;
import io.server.backend.dto.response.AppointmentDoctorsResponse;
import io.server.backend.dto.response.AppointmentPatientsResponse;
import io.server.backend.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final AppointmentDoctorsMapper appointmentDoctorsMapper;
    private final AppointmentPatientsMapper appointmentPatientsMapper;

    public List<AppointmentPatientsResponse> getAllAppointmentPatients(Long doctorId) {
        return appointmentRepository.findAllByDoctorId(doctorId)
                .stream()
                .map(appointmentPatientsMapper)
                .collect(Collectors.toList());
    }

    public List<AppointmentDoctorsResponse> getAllAppointmentDoctors(Long patientId) {
        return appointmentRepository.findAllByPatientId(patientId)
                .stream()
                .map(appointmentDoctorsMapper)
                .collect(Collectors.toList());
    }
}
