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
import jakarta.persistence.ManyToOne;
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
@Table(name = "Doctors")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Doctor {

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

    @Column
    private String conselho;

    @Column
    private String ufconselho;

    @Column
    private String registro;

    @Column
    private String title;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialty_id")
    private Specialty specialty;

    @ManyToMany
    @JoinTable(
            name = "DoctorHealthInsurances",
            joinColumns = @JoinColumn(name = "doctorId"),
            inverseJoinColumns = @JoinColumn(name = "healthInsuranceId")
    )
    private Set<HealthInsurance> healthinsurances = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "DoctorsDocumentses",
            joinColumns = @JoinColumn(name = "doctorId"),
            inverseJoinColumns = @JoinColumn(name = "documentId")
    )
    private Set<Document> documents = new HashSet<>();

    @OneToMany(mappedBy = "doctor")
    private Set<DoctorsAvailableSchedule> doctorsAvailableSchedules = new HashSet<>();

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private OffsetDateTime dateCreated;

    @LastModifiedDate
    @Column(nullable = false)
    private OffsetDateTime lastUpdated;

}
