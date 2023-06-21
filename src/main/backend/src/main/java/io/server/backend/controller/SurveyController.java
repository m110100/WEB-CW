package io.server.backend.controller;

import io.server.backend.dto.request.CompleteSurveyRequest;
import io.server.backend.dto.request.SurveyRequest;
import io.server.backend.dto.response.*;
import io.server.backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/management/surveys")
@RequiredArgsConstructor
public class SurveyController {
    private final SurveyService surveyService;
    private final UserService userService;
    private final QuestionService questionService;
    private final AnswerService answerService;
    private final RecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<List<SurveyInfoResponse>> findAllSurveys() {
        if (surveyService.getAllSurveys() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(surveyService.getAllSurveys());
    }

    @GetMapping("/patient")
    public ResponseEntity<List<PatientSurveyInfo>> findAllPatientSurveys(@RequestParam(name = "id") Long patientId) {
        if (surveyService.getAllPatientSurveysInfo(patientId) == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(surveyService.getAllPatientSurveysInfo(patientId));
    }

    @GetMapping("/patient/results")
    public ResponseEntity<List<PatientResultsResponse>> findPatientResults(
            @RequestParam(name = "patientId") Long patientId,
            @RequestParam(name = "surveyId") Long surveyId
    ) {
        if (surveyService.getSurveyInfoById(surveyId) == null) {
            return ResponseEntity.notFound().build();
        }

        if (userService.getUserById(patientId) == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(surveyService.getPatientResults(patientId, surveyId));
    }

    @GetMapping("/doctor")
    public ResponseEntity<List<SurveyInfoResponse>> findAllDoctorSurveys(@RequestParam(name = "id") Long doctorId) {
        if (surveyService.getAllDoctorSurveysInfo(doctorId) == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(surveyService.getAllDoctorSurveysInfo(doctorId));
    }

    @GetMapping("/latest")
    public ResponseEntity<List<LatestSurveyResponse>> findAllDoctorLatestSurveys(
            @RequestParam(name = "id") Long doctorId) {
        if (surveyService.getAllDoctorLatestSurveys(doctorId) == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(surveyService.getAllDoctorLatestSurveys(doctorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SurveyInfoResponse> findSurveyById(@PathVariable Long id) {
        if (surveyService.getSurveyInfoById(id) == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(surveyService.getSurveyInfoById(id));
    }

    @GetMapping("/{id}/questions")
    public ResponseEntity<List<QuestionResponse>> findAllQuestionsBySurveyId(@PathVariable Long id) {
        if (surveyService.getSurveyInfoById(id) == null) {
            return ResponseEntity.status(404).build();
        }

//        return ResponseEntity.ok(questionService.getAllQuestionsBySurveyId(id));
        return ResponseEntity.ok(questionService.getAllQuestionsWithAnswers(id));
    }

    @GetMapping("/{id}/recommendations")
    public ResponseEntity<List<RecommendationResponse>> findAllRecommendationsBySurveyId(@PathVariable Long id) {
        if (surveyService.getSurveyInfoById(id) == null) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.ok(recommendationService.getAllRecommendationsBySurveyId(id));
    }

    @GetMapping("/{id}/questions/{questionId}/answers")
    public ResponseEntity<List<AnswerResponse>> findAllAnswersByQuestionId(
            @PathVariable Long id,
            @PathVariable Long questionId) {
        if (surveyService.getSurveyInfoById(id) == null || questionService.getQuestionById(questionId) == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(answerService.getAllAnswersByQuestionId(questionId));
    }

    @PostMapping
    public ResponseEntity<SurveyRequest> addSurvey(@RequestBody SurveyRequest surveyRequest) {
        surveyService.createSurvey(surveyRequest);
        return ResponseEntity.ok(surveyRequest);
    }

    @PostMapping("/survey-results")
    public ResponseEntity<Void> publishSurveyResults(@RequestBody List<CompleteSurveyRequest> results) {
        surveyService.saveSurveyResults(results);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSurveyById(@PathVariable Long id) {
        surveyService.disableSurveyById(id);
        return ResponseEntity.noContent().build();
    }
}
