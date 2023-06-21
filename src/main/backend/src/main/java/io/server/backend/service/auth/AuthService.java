package io.server.backend.service.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.server.backend.dto.request.AuthenticationRequest;
import io.server.backend.dto.request.EmailAccessTokenRequest;
import io.server.backend.dto.request.EmailConfirmTokenRequest;
import io.server.backend.dto.request.UserRequest;
import io.server.backend.dto.response.AuthenticationResponse;
import io.server.backend.model.EmailAccessToken;
import io.server.backend.model.EmailConfirmationToken;
import io.server.backend.model.Token;
import io.server.backend.model.User;
import io.server.backend.model.enums.RoleType;
import io.server.backend.repository.RoleRepository;
import io.server.backend.repository.TokenRepository;
import io.server.backend.repository.UserRepository;
import io.server.backend.service.auth.email.EmailService;
import io.server.backend.service.auth.email.EmailTokenService;
import io.server.backend.service.auth.email.EmailValidator;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;

    // Email confirmation
    private final EmailTokenService emailTokenService;
    private final EmailValidator emailValidator;
    private final EmailService emailService;

    @Transactional
    public void register(UserRequest userRequest) {
        // This validation might be redundant. Already do it on the client
        boolean isValidEmail = emailValidator.test(userRequest.email());

        if (!isValidEmail) {
            throw new RuntimeException("Email is not valid");
        }

        var role = roleRepository.findByName(RoleType.PATIENT)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        var user = User.builder()
                .surname(userRequest.surname())
                .name(userRequest.name())
                .patronymic(userRequest.patronymic())
                .insurancePolicy(userRequest.insurancePolicy())
                .email(userRequest.email())
                .password(passwordEncoder.encode(userRequest.password()))
                .isEnabled(false)
                .role(role)
                .build();

        var savedUser = userRepository.save(user);

        String token = generateConfirmEmailToken(savedUser);
        emailService.sendConfirmationToken(savedUser.getEmail(), buildEmail(token));
    }

    //AuthenticationResponseDTO
    public void login(AuthenticationRequest authenticationRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authenticationRequest.email(),
                        authenticationRequest.password()
                )
        );

        var user = userRepository.findByEmail(authenticationRequest.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = generateAccessEmailToken(user);
        emailService.sendAccessToken(user.getEmail(), buildEmail(token));
//        var jwtToken = jwtService.generateToken(user);
//        var refreshToken = jwtService.generateRefreshToken(user);
//
//        revokeAllUserTokens(user);
//        saveUserToken(user, jwtToken);
//
//        return AuthenticationResponseDTO.builder()
//                .accessToken(jwtToken)
//                .refreshToken(refreshToken)
//                .build();
    }

    @Transactional
    public AuthenticationResponse authenticate(EmailAccessTokenRequest request) {
        EmailAccessToken emailAccessToken = emailTokenService.getAccessToken(request.token())
                .orElseThrow(() -> new RuntimeException("Token not found"));

        if (emailAccessToken.getConfirmedAt() != null) {
            throw new RuntimeException("Access token already confirmed");
        }

        if (emailAccessToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Access token expired");
        }

        emailTokenService.setConfirmedAtToAccessToken(request.token());

        User user = emailAccessToken.getUser();

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;

        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            return;
        }

        refreshToken = authHeader.substring(7);

        userEmail = jwtService.extractEmail(refreshToken);

        if (userEmail != null) {
            var user = this.userRepository.findByEmail(userEmail)
                    .orElseThrow();

            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);

                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);

                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();

                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    private void saveUserToken(User user, String jwtToken) {
        if (tokenRepository.findByToken(jwtToken).isPresent()) {
            return;
        }

        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .expired(false)
                .revoked(false)
                .build();

        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());

        if (validUserTokens.isEmpty()) {
            return;
        }

        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });

        tokenRepository.saveAll(validUserTokens);
    }

    @Transactional
    public void confirmConfirmationToken(EmailConfirmTokenRequest request) {
        EmailConfirmationToken emailConfirmationToken = emailTokenService.getConfirmationToken(request.token())
                .orElseThrow(() -> new RuntimeException("Token not found"));

        if (emailConfirmationToken.getConfirmedAt() != null) {
            throw new RuntimeException("Email already confirmed");
        }

        if (emailConfirmationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Confirmation token expired");
        }

        emailTokenService.setConfirmedAtToConfirmationToken(request.token());
        enableUser(emailConfirmationToken.getUser().getEmail());
    }

    private String generateConfirmEmailToken(User user) {
        String token = UUID.randomUUID().toString();

        EmailConfirmationToken confirmationToken = EmailConfirmationToken.builder()
                .token(token)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();

        emailTokenService.saveEmailConfirmationToken(confirmationToken);

        return token;
    }

    private String generateAccessEmailToken(User user) {
        String token = UUID.randomUUID().toString();

        EmailAccessToken accessToken = EmailAccessToken.builder()
                .token(token)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();

        emailTokenService.saveEmailAccessToken(accessToken);

        return token;
    }

    private String buildEmail(String token) {
        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
                "<p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">" + token + "</p>\n" +
                "</div>";
    }

    private void enableUser(String email) {
        userRepository.enableUser(email);
    }
}
