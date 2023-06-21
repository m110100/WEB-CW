package io.server.backend.repository;

import io.server.backend.model.Appointment;
import io.server.backend.model.Survey;
import io.server.backend.model.SurveyResult;
import io.server.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Query("SELECT DISTINCT sr FROM SurveyResult sr " +
            "INNER JOIN sr.survey s " +
            "INNER JOIN sr.question q " +
            "INNER JOIN sr.recommendation r " +
            "INNER JOIN s.user u " +
            "INNER JOIN Appointment a ON a.patient = u " +
            "WHERE a.doctor = :doctor")
    List<SurveyResult> getSurveyResultsForDoctor(@Param("doctor") User doctor);

    List<Appointment> findAllByDoctorId(Long doctorId);
    List<Appointment> findAllByPatientId(Long patientId);
}
