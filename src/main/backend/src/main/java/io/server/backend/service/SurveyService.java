package io.server.backend.service;

import io.server.backend.dto.mapper.PatientMapper;
import io.server.backend.dto.mapper.PatientResultsMapper;
import io.server.backend.dto.mapper.SurveyMapper;
import io.server.backend.dto.request.*;
import io.server.backend.dto.response.*;
import io.server.backend.model.*;
import io.server.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SurveyService {
    private final SurveyRepository surveyRepository;

    private final SpecialityService specialityService;
    private final UserService userService;
    private final QuestionService questionService;
    private final AnswerService answerService;
    private final RecommendationService recommendationService;
    private final SurveyResultService surveyResultService;

    private final PatientResultsMapper patientResultsMapper;
    private final PatientMapper patientMapper;
    private final SurveyMapper surveyMapper;

    public List<SurveyInfoResponse> getAllSurveys() {
        return surveyRepository.findAll()
                .stream()
                .map(surveyMapper)
                .collect(Collectors.toList());
    }

    public List<SurveyInfoResponse> getAllDoctorSurveysInfo(Long doctorId) {
        return surveyRepository.findByUserIdAndIsEnabledIsTrueOrderByCreatedAtDesc(doctorId)
                .stream()
                .map(surveyMapper)
                .collect(Collectors.toList());
    }

    public List<SurveyInfoResponse> getAllSurveysPatientWhichHaveDoctorAppointment(Long doctorId) {
        return surveyRepository.findAllSurveysPatientWhichHaveDoctorAppointment(doctorId)
                .stream()
                .map(surveyMapper)
                .collect(Collectors.toList());
    }

    public List<PatientSurveyInfo> getAllPatientSurveysInfo(Long patientId) {
        List<PatientSurveyInfo> allPatientSurveysByDoctorAppointment = surveyRepository.
                findAllPatientSurveysByDoctorAppointment(patientId);

        List<PatientSurveyInfo> allPublicSurveys = surveyRepository
                .findAllPublicSurveys(patientId);

        List<PatientSurveyInfo> allSurveys = new ArrayList<>();

        allSurveys.addAll(allPatientSurveysByDoctorAppointment);
        allSurveys.addAll(allPublicSurveys);

        return allSurveys;
    }

    public List<PatientResultsResponse> getPatientResults(Long patientId, Long surveyId) {
        List<PatientResults> patientResults = surveyRepository.findPatientResults(patientId, surveyId);

        return patientResults
                .stream()
                .map(patientResultsMapper)
                .collect(Collectors.toList());
    }

    public List<PatientResponse> getAllPatientsWhichCompleteDoctorSurvey(Long doctorId, Long surveyId) {
        return surveyRepository.findPatientsWhichCompleteDoctorSurvey(doctorId, surveyId)
                .stream()
                .map(patientMapper)
                .collect(Collectors.toList());
    }

    public List<PatientResponse> getAllPatientsWhichCompleteSurveyAndHaveDoctorAppointment(Long doctorId, Long surveyId) {
        return surveyRepository.findPatientsWhichCompleteSurveyAndHaveDoctorAppointment(doctorId, surveyId)
                .stream()
                .map(patientMapper)
                .collect(Collectors.toList());
    }

    public List<LatestSurveyResponse> getAllDoctorLatestSurveys(Long doctorId) {
        return surveyRepository.findLatestSurveys(doctorId, PageRequest.of(0, 5));
    }

    public SurveyInfoResponse getSurveyInfoById(Long id) {
        return surveyRepository.findByIdAndIsEnabledIsTrue(id)
                .map(surveyMapper)
                .orElseThrow(() -> new RuntimeException(
                   "Survey with id %s not found".formatted(id)
                ));
    }

    @Transactional
    public void createSurvey(SurveyRequest surveyRequest) {
        Speciality speciality = null;

        if (surveyRequest.speciality() != null) {
            speciality = specialityService.getSpecialityByName(surveyRequest.speciality().getName());
        }

        var user = userService.getUserById(surveyRequest.userId());

        var survey = Survey.builder()
                    .title(surveyRequest.title())
                    .description(surveyRequest.description())
                    .isRating(surveyRequest.isRating())
                    .isPublic(surveyRequest.isPublic())
                    .createdAt(LocalDateTime.now())
                    .isEnabled(true)
                    .speciality(speciality)
                    .user(user)
                    .build();

        Survey savedSurvey = surveyRepository.save(survey);

        for (QuestionRequest questionRequest : surveyRequest.questions()) {
            var question = Question.builder()
                    .questionText(questionRequest.questionText())
                    .questionType(questionRequest.questionType())
                    .isTemplate(null)
                    .order(questionRequest.order())
                    .inputMinLimit(questionRequest.inputMinLimit())
                    .inputMaxLimit(questionRequest.inputMaxLimit())
                    .survey(savedSurvey)
                    .build();

            Question savedQuestion = questionService.saveQuestion(question);

            for (AnswerRequest answerRequest : questionRequest.answers()) {
                var answer = Answer.builder()
                        .answerText(answerRequest.answerText())
                        .score(answerRequest.score())
                        .order(answerRequest.order())
                        .question(savedQuestion)
                        .build();

                Answer savedAnswer = answerService.saveAnswer(answer);
            }
        }

        if (surveyRequest.recommendations() != null) {
            for (RecommendationRequest recommendationRequest : surveyRequest.recommendations()) {
                var recommendation = Recommendation.builder()
                        .recommendationText(recommendationRequest.recommendationText())
                        .minScore(recommendationRequest.minScore())
                        .maxScore(recommendationRequest.maxScore())
                        .survey(savedSurvey)
                        .build();

                Recommendation savedRecommendation = recommendationService.saveRecommendation(recommendation);
            }
        }
    }

    @Transactional
    public void disableSurveyById(Long surveyId) {
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new RuntimeException("Survey with id %s not found".formatted(surveyId)));

        if (survey != null) {
            surveyRepository.disableSurveyById(surveyId);
        }
    }

    @Transactional
    public void saveSurveyResults(List<CompleteSurveyRequest> requests) {
        LocalDate passageDate = LocalDate.now();

        for (CompleteSurveyRequest request : requests) {
            Question question = questionService.getQuestionModelById(request.question().id());

            Survey survey = surveyRepository.findById(request.survey().id())
                    .orElseThrow(() -> new RuntimeException(
                            "Survey with id %s not found".formatted(request.survey().id())
                    ));

            User user = userService.getUserById(request.userId());

            Recommendation recommendation = null;
            if (request.recommendation() != null) {
                recommendation = recommendationService.getRecommendationById(request.recommendation().id());
            }

            String givenAnswer = request.givenAnswer();

            SurveyResult result = SurveyResult.builder()
                    .answerText(givenAnswer)
                    .passageDate(passageDate)
                    .question(question)
                    .survey(survey)
                    .recommendation(recommendation)
                    .user(user)
                    .build();

            surveyResultService.saveSurveyResult(result);
        }
    }
}
