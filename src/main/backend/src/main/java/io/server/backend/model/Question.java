package io.server.backend.model;

import io.server.backend.model.enums.QuestionType;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question_text", nullable = false)
    private String questionText;

    @Column(name = "question_type", nullable = false)
    @Enumerated(value = EnumType.STRING)
    private QuestionType questionType;

    @Column(name = "question_order", nullable = false)
    private Integer order;

    @Column(name = "input_min_limit", nullable = true)
    private Integer inputMinLimit;

    @Column(name = "input_max_limit", nullable = true)
    private Integer inputMaxLimit;

    @ManyToOne
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;

    @OneToMany(mappedBy = "question")
    private List<Answer> answers;

    @OneToMany(mappedBy = "question")
    private List<SurveyResult> surveyResults;
}
