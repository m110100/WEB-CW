package io.server.backend.repository;

import io.server.backend.dto.response.LatestSurveyResponse;
import io.server.backend.dto.response.PatientResults;
import io.server.backend.dto.response.PatientSurveyInfo;
import io.server.backend.model.Survey;
import io.server.backend.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    List<Survey> findByUserIdAndIsEnabledIsTrueOrderByCreatedAtDesc(Long userId);

    Optional<Survey> findByIdAndIsEnabledIsTrue(Long id);

    @Transactional
    @Modifying
    @Query("UPDATE Survey s SET s.isEnabled = false WHERE s.id = :surveyId")
    void disableSurveyById(@Param("surveyId") Long surveyId);

    @Query("SELECT DISTINCT u " +
            "FROM User u " +
            "JOIN u.surveyResults sr " +
            "JOIN sr.survey s " +
            "WHERE s.user.id = :doctorId " +
            "AND s.id = :surveyId")
    List<User> findPatientsWhichCompleteDoctorSurvey(@Param("doctorId") Long doctorId, @Param("surveyId") Long surveyId);

    @Query("SELECT DISTINCT u " +
            "FROM User u " +
            "JOIN u.patientAppointments a " +
            "JOIN u.surveyResults sr " +
            "WHERE a.doctor.id = :doctorId " +
            "AND sr.survey.id = :surveyId")
    List<User> findPatientsWhichCompleteSurveyAndHaveDoctorAppointment(
            @Param("doctorId") Long doctorId,
            @Param("surveyId") Long surveyId
    );

    @Query("SELECT DISTINCT s " +
            "FROM Survey s " +
            "JOIN s.surveyResults sr " +
            "JOIN sr.user p " +
            "JOIN p.patientAppointments a " +
            "WHERE a.doctor.id = :doctorId " +
            "AND s.user.id <> :doctorId")
    List<Survey> findAllSurveysPatientWhichHaveDoctorAppointment(@Param("doctorId") Long doctorId);

    @Query("SELECT new io.server.backend.dto.response.LatestSurveyResponse(s.id, s.title, COUNT(DISTINCT sr.user.id), s.createdAt) " +
            "FROM Survey s " +
            "LEFT JOIN s.surveyResults sr " +
            "WHERE s.user.id = :userId AND s.isEnabled = true " +
            "GROUP BY s.id, s.title, s.createdAt " +
            "ORDER BY s.createdAt DESC")
    List<LatestSurveyResponse> findLatestSurveys(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT new io.server.backend.dto.response.PatientSurveyInfo(sur.id, sur.title, sur.description, " +
            "s.name, MAX(sr.passageDate)) " +
            "FROM Appointment a " +
            "JOIN a.doctor d " +
            "JOIN d.speciality s " +
            "JOIN a.patient p " +
            "JOIN s.surveys sur " +
            "LEFT JOIN sur.surveyResults sr ON (sr.user.id = p.id) " +
            "WHERE p.id = :patientId AND sur.isEnabled = true " +
            "GROUP BY sur.id, s.name")
    List<PatientSurveyInfo> findAllPatientSurveysByDoctorAppointment(@Param("patientId") Long patientId);


    @Query("SELECT new io.server.backend.dto.response.PatientSurveyInfo(sur.id, sur.title, sur.description, " +
            "s.name, MAX(sr.passageDate)) " +
            "FROM Survey sur " +
            "LEFT JOIN sur.speciality s " +
            "LEFT JOIN sur.surveyResults sr ON (sr.user.id = :patientId) " +
            "WHERE sur.isPublic = true AND sur.isEnabled = true " +
            "GROUP BY sur.id, s.name")
    List<PatientSurveyInfo> findAllPublicSurveys(@Param("patientId") Long patientId);

    @Query("SELECT new io.server.backend.dto.response.PatientResults(r.recommendationText, q, sr.answerText) " +
            "FROM SurveyResult sr " +
            "JOIN sr.user u " +
            "LEFT JOIN sr.recommendation r " +
            "JOIN sr.question q " +
            "WHERE u.id = :patientId " +
            "AND sr.survey.id = :surveyId " +
            "AND sr.passageDate = (" +
            "    SELECT MAX(sr2.passageDate) " +
            "    FROM SurveyResult sr2 " +
            "    WHERE sr2.user.id = :patientId " +
            "    AND sr2.survey.id = :surveyId" +
            ") " +
            "ORDER BY q.order")
    List<PatientResults> findPatientResults(@Param("patientId") Long patientId, @Param("surveyId") Long surveyId);
}
