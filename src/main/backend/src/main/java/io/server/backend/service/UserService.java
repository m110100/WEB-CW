package io.server.backend.service;

import io.server.backend.dto.mapper.PatientMapper;
import io.server.backend.dto.mapper.UserMapper;
import io.server.backend.dto.response.PatientResponse;
import io.server.backend.dto.response.UserResponse;
import io.server.backend.model.User;
import io.server.backend.model.enums.RoleType;
import io.server.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PatientMapper patientMapper;

    public UserResponse getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper)
                .orElseThrow(() -> new RuntimeException(
                        "User not found"
                ));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<PatientResponse> getAllPatients() {
        return userRepository.findAllByRoleName(RoleType.PATIENT)
                .stream()
                .map(patientMapper)
                .collect(Collectors.toList());
    }
}
