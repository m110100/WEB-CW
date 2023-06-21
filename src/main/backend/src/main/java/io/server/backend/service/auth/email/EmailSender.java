package io.server.backend.service.auth.email;

public interface EmailSender {
    void sendConfirmationToken(String to, String email);
    void sendAccessToken(String to, String email);
}
