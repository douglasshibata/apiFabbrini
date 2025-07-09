package br.com.kontongroup.api.fabbrini.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
@Table(name = "HealthInsurances")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class HealthInsurance {

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
    private String number;

    @Column
    private String type;

    @Column
    private String plan;

    @Column
    private String carrier;

    @Column
    private Boolean active;

    @ManyToMany(mappedBy = "healthinsurances")
    private Set<Doctor> doctors = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "DocumentHealthInsurances",
            joinColumns = @JoinColumn(name = "healthInsuranceId"),
            inverseJoinColumns = @JoinColumn(name = "documentId")
    )
    private Set<Document> documents = new HashSet<>();

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private OffsetDateTime dateCreated;

    @LastModifiedDate
    @Column(nullable = false)
    private OffsetDateTime lastUpdated;

}
