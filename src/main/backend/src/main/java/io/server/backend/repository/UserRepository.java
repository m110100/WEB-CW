package io.server.backend.repository;

import io.server.backend.model.User;
import io.server.backend.model.enums.RoleType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findAllByRoleName(RoleType name);

    @Transactional
    @Modifying
    @Query("UPDATE User u " +
        "SET u.isEnabled = TRUE WHERE u.email = ?1")
    int enableUser(String email);
}
