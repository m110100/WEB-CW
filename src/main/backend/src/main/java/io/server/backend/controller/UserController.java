package io.server.backend.controller;

import io.server.backend.dto.response.PatientResponse;
import io.server.backend.dto.response.UserResponse;
import io.server.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/management/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{email}")
    public ResponseEntity<UserResponse> findUserByEmail(@PathVariable String email) {
        if (userService.getUserByEmail(email) == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @GetMapping("/patients")
    public ResponseEntity<List<PatientResponse>> findAllPatients() {
        return ResponseEntity.ok(userService.getAllPatients());
    }
}
