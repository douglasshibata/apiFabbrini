package br.com.kontongroup.api.fabbrini.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;


@Entity
@Table(name = "Patients")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Patient {

    @Id
    @Column(nullable = false, updatable = false)
    @SequenceGenerator(
            name = "primary_sequence",
            sequenceName = "primary_sequence",
            allocationSize = 1,
            initialValue = 10000
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "primary_sequence"
    )
    private Long id;

    @Column(nullable = false)
    private String fullname;

    @Column(unique = true)
    private String cpf;

    @Column
    private String rg;

    @Column
    private String socialname;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToMany
    @JoinTable(
            name = "PatientDocumentses",
            joinColumns = @JoinColumn(name = "patientId"),
            inverseJoinColumns = @JoinColumn(name = "documentId")
    )
    private Set<Document> documents = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "PatientHealthInsuranceses",
            joinColumns = @JoinColumn(name = "patientId"),
            inverseJoinColumns = @JoinColumn(name = "healthInsuranceId")
    )
    private Set<HealthInsurance> healthInsurances = new HashSet<>();

    @OneToMany(mappedBy = "patient")
    private Set<Responsible> responsibles = new HashSet<>();

    @OneToMany(mappedBy = "patient")
    private Set<Schedule> schedules = new HashSet<>();

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private OffsetDateTime dateCreated;

    @LastModifiedDate
    @Column(nullable = false)
    private OffsetDateTime lastUpdated;

}
