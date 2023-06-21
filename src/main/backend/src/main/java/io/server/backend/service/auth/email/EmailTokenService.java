package io.server.backend.service.auth.email;

import io.server.backend.model.EmailAccessToken;
import io.server.backend.model.EmailConfirmationToken;
import io.server.backend.repository.EmailAccessTokenRepository;
import io.server.backend.repository.EmailConfirmationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmailTokenService {
    private final EmailConfirmationTokenRepository emailConfirmationTokenRepository;
    private final EmailAccessTokenRepository emailAccessTokenRepository;

    // Confirmation Token
    public void saveEmailConfirmationToken(EmailConfirmationToken emailConfirmationToken) {
        emailConfirmationTokenRepository.save(emailConfirmationToken);
    }

    public Optional<EmailConfirmationToken> getConfirmationToken(String token) {
        return emailConfirmationTokenRepository.findByToken(token);
    }

    public int setConfirmedAtToConfirmationToken(String token) {
        return emailConfirmationTokenRepository.updateConfirmedAt(token, LocalDateTime.now());
    }

    // Access Token
    public void saveEmailAccessToken(EmailAccessToken emailAccessToken) {
        emailAccessTokenRepository.save(emailAccessToken);
    }

    public Optional<EmailAccessToken> getAccessToken(String token) {
        return emailAccessTokenRepository.findByToken(token);
    }

    public int setConfirmedAtToAccessToken(String token) {
        return emailAccessTokenRepository.updateConfirmedAt(token, LocalDateTime.now());
    }

}
