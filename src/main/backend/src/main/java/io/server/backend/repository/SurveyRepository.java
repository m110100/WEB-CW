package io.server.backend.repository;

import io.server.backend.dto.response.LatestSurveyResponse;
import io.server.backend.dto.response.PatientResults;
import io.server.backend.dto.response.PatientSurveyInfo;
import io.server.backend.model.Survey;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    List<Survey> findByUserIdAndIsEnabledIsTrueOrderByCreatedAtDesc(Long userId);

    @Transactional
    @Modifying
    @Query("UPDATE Survey s SET s.isEnabled = false WHERE s.id = :surveyId")
    void disableSurveyById(@Param("surveyId") Long surveyId);

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
            "WHERE p.id = :patientId " +
            "GROUP BY sur.id, s.name")
    List<PatientSurveyInfo> findAllPatientSurveysByDoctorAppointment(@Param("patientId") Long patientId);


    @Query("SELECT new io.server.backend.dto.response.PatientSurveyInfo(sur.id, sur.title, sur.description, " +
            "s.name, MAX(sr.passageDate)) " +
            "FROM Survey sur " +
            "LEFT JOIN sur.speciality s " +
            "LEFT JOIN sur.surveyResults sr ON (sr.user.id = :patientId) " +
            "WHERE sur.isPublic = true " +
            "GROUP BY sur.id, s.name")
    List<PatientSurveyInfo> findAllPublicSurveys(@Param("patientId") Long patientId);

    @Query("SELECT new io.server.backend.dto.response.PatientResults(r.recommendationText, q, sr.answerText) " +
            "FROM SurveyResult sr " +
            "JOIN sr.user u " +
            "JOIN sr.recommendation r " +
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
