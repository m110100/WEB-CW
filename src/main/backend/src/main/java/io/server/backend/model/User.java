package io.server.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "surname", length = 150, nullable = false)
    private String surname;

    @Column(name = "name", length = 150, nullable = false)
    private String name;

    @Column(name = "patronymic", length = 150)
    private String patronymic;

    @Column(unique = true, name = "insurance_policy", length = 16, nullable = false)
    private String insurancePolicy;

    @Column(unique = true, name = "email", length = 64, nullable = false)
    private String email;

    @Column(name = "password", length = 64, nullable = false)
    private String password;

    @Column(name = "is_enabled", nullable = false)
    private Boolean isEnabled;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "speciality_id")
    private Speciality speciality;

    @OneToMany(mappedBy = "user")
    private List<Survey> surveys;

    @OneToMany(mappedBy = "user")
    private List<SurveyResult> surveyResults;

    @OneToMany(mappedBy = "patient")
    private List<Appointment> patientAppointments;

    @OneToMany(mappedBy = "doctor")
    private List<Appointment> doctorAppointments;

    @OneToMany(mappedBy = "user")
    private List<Token> tokens;

    // UserDetails impl

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.getName().name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isEnabled;
    }
}
