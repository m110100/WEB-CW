package io.server.backend.controller;

import io.server.backend.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/management/questions")
@RequiredArgsConstructor
public class QuestionController {
    private QuestionService questionService;


}
