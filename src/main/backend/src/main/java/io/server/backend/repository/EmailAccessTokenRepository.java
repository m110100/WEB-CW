package io.server.backend.repository;

import io.server.backend.model.EmailAccessToken;
import io.server.backend.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface EmailAccessTokenRepository extends JpaRepository<EmailAccessToken, Long> {
    Optional<EmailAccessToken> findByToken(String token);

    @Transactional
    @Modifying
    @Query("UPDATE EmailAccessToken e " +
            "SET e.confirmedAt = ?2 " +
            "WHERE e.token = ?1")
    int updateConfirmedAt(String token, LocalDateTime confirmedAt);
}
