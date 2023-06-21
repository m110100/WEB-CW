package io.server.backend.controller;

import io.server.backend.dto.response.SpecialityResponse;
import io.server.backend.service.SpecialityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/management/specialities")
@RequiredArgsConstructor
public class SpecialityController {
    private final SpecialityService specialityService;

    @GetMapping
    public ResponseEntity<List<SpecialityResponse>> findAllSpecialities() {
        if (specialityService.getAllSpecialties() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(specialityService.getAllSpecialties());
    }
}
