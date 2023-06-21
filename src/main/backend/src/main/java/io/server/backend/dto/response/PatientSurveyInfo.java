package io.server.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PatientSurveyInfo {
    private Long id;
    private String title;
    private String description;
    private String speciality;
    private LocalDate lastPassageDate;

    public PatientSurveyInfo(Long id, String title, String description, String speciality, LocalDate lastPassageDate) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.speciality = speciality;
        this.lastPassageDate = lastPassageDate;
    }
}
