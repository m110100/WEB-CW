package io.server.backend.service;

import io.server.backend.dto.mapper.SpecialityMapper;
import io.server.backend.dto.response.SpecialityResponse;
import io.server.backend.model.Speciality;
import io.server.backend.repository.SpecialityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpecialityService {
    private final SpecialityRepository specialityRepository;
    private final SpecialityMapper specialityMapper;

    public Speciality getSpecialityByName(String name) {
        return specialityRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Speciality not found"));
    }

    public List<SpecialityResponse> getAllSpecialties() {
        return specialityRepository.findAll()
                .stream()
                .map(specialityMapper)
                .collect(Collectors.toList());
    }
}
