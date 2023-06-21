package io.server.backend.controller;

import io.server.backend.dto.request.AuthenticationRequest;
import io.server.backend.dto.request.EmailAccessTokenRequest;
import io.server.backend.dto.request.EmailConfirmTokenRequest;
import io.server.backend.dto.request.UserRequest;
import io.server.backend.dto.response.AuthenticationResponse;
import io.server.backend.service.auth.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody UserRequest userRequest) {
        authService.register(userRequest);

        return ResponseEntity.status(200).build();
    }

    @PostMapping("/signup/confirm")
    public ResponseEntity<Void> confirmEmail(@RequestBody EmailConfirmTokenRequest token) {
        if (token == null || token.token().isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        authService.confirmConfirmationToken(token);

        return ResponseEntity.status(200).build();
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(
            @RequestBody AuthenticationRequest authenticationRequest) {

        authService.login(authenticationRequest);

        return ResponseEntity.status(200).build();
    }

    @PostMapping("/login/confirm")
    public ResponseEntity<AuthenticationResponse> confirmLogin(@RequestBody EmailAccessTokenRequest token) {
        if (token == null || token.token().isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(authService.authenticate(token));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        authService.refreshToken(request, response);
    }
}
