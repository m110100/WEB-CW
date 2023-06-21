package io.server.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "answer")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "answer_text", length = 100, nullable = false)
    private String answerText;

    @Column(name = "score")
    private Integer score;

    @Column(name = "answer_order", nullable = false)
    private Integer order;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
}
