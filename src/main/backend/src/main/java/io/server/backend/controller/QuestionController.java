package io.server.backend.controller;

import io.server.backend.dto.response.QuestionResponse;
import io.server.backend.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/management/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    @GetMapping("/template")
    public ResponseEntity<List<QuestionResponse>> findAllTemplateQuestions() {
        return ResponseEntity.ok( questionService.getAllTemplateQuestions());
    }
}
