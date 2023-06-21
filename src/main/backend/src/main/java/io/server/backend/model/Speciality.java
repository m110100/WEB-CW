package io.server.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "speciality")
public class Speciality {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, name = "name", length = 25, nullable = false)
    private String name;

    @OneToMany(mappedBy = "speciality")
    private List<Survey> surveys;

    @OneToMany(mappedBy = "speciality")
    private List<User> users;
}
