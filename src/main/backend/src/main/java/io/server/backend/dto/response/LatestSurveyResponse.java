package io.server.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class LatestSurveyResponse {
    private long id;
    private String title;
    private long responseCount;
    private LocalDateTime createdAt;

    public LatestSurveyResponse(long id, String title, long responseCount, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.responseCount = responseCount;
        this.createdAt = createdAt;
    }
}
