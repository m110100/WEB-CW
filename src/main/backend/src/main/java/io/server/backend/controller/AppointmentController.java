package io.server.backend.controller;

import io.server.backend.dto.response.AppointmentDoctorsResponse;
import io.server.backend.dto.response.AppointmentPatientsResponse;
import io.server.backend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/management/appointments")
@RequiredArgsConstructor
public class AppointmentController {
    private final AppointmentService appointmentService;

    @GetMapping("/doctor")
    public ResponseEntity<List<AppointmentPatientsResponse>> findAllAppointmentPatients(
            @RequestParam(name = "id") Long doctorId
    ) {
        if (appointmentService.getAllAppointmentPatients(doctorId) == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(appointmentService.getAllAppointmentPatients(doctorId));
    }

    @GetMapping("/patient")
    public ResponseEntity<List<AppointmentDoctorsResponse>> findAllAppointmentDoctors(
            @RequestParam(name = "id") Long patientId
    ) {
        if (appointmentService.getAllAppointmentDoctors(patientId) == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(appointmentService.getAllAppointmentDoctors(patientId));
    }
}
