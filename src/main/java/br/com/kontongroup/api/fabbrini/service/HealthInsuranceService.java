package br.com.kontongroup.api.fabbrini.service;

import br.com.kontongroup.api.fabbrini.domain.Document;
import br.com.kontongroup.api.fabbrini.domain.HealthInsurance;
import br.com.kontongroup.api.fabbrini.model.HealthInsuranceDTO;
import br.com.kontongroup.api.fabbrini.repos.DoctorRepository;
import br.com.kontongroup.api.fabbrini.repos.DocumentRepository;
import br.com.kontongroup.api.fabbrini.repos.HealthInsuranceRepository;
import br.com.kontongroup.api.fabbrini.repos.PatientRepository;
import br.com.kontongroup.api.fabbrini.util.NotFoundException;
import java.util.HashSet;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional(rollbackFor = Exception.class)
public class HealthInsuranceService {

    private final HealthInsuranceRepository healthInsuranceRepository;
    private final DocumentRepository documentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public HealthInsuranceService(final HealthInsuranceRepository healthInsuranceRepository,
            final DocumentRepository documentRepository, final DoctorRepository doctorRepository,
            final PatientRepository patientRepository) {
        this.healthInsuranceRepository = healthInsuranceRepository;
        this.documentRepository = documentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    public List<HealthInsuranceDTO> findAll() {
        final List<HealthInsurance> healthInsurances = healthInsuranceRepository.findAll(Sort.by("id"));
        return healthInsurances.stream()
                .map(healthInsurance -> mapToDTO(healthInsurance, new HealthInsuranceDTO()))
                .toList();
    }

    public HealthInsuranceDTO get(final Long id) {
        return healthInsuranceRepository.findById(id)
                .map(healthInsurance -> mapToDTO(healthInsurance, new HealthInsuranceDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final HealthInsuranceDTO healthInsuranceDTO) {
        final HealthInsurance healthInsurance = new HealthInsurance();
        mapToEntity(healthInsuranceDTO, healthInsurance);
        return healthInsuranceRepository.save(healthInsurance).getId();
    }

    public void update(final Long id, final HealthInsuranceDTO healthInsuranceDTO) {
        final HealthInsurance healthInsurance = healthInsuranceRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(healthInsuranceDTO, healthInsurance);
        healthInsuranceRepository.save(healthInsurance);
    }

    public void delete(final Long id) {
        final HealthInsurance healthInsurance = healthInsuranceRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        // remove many-to-many relations at owning side
        doctorRepository.findAllByHealthinsurances(healthInsurance)
                .forEach(doctor -> doctor.getHealthinsurances().remove(healthInsurance));
        patientRepository.findAllByHealthInsurances(healthInsurance)
                .forEach(patient -> patient.getHealthInsurances().remove(healthInsurance));
        healthInsuranceRepository.delete(healthInsurance);
    }

    private HealthInsuranceDTO mapToDTO(final HealthInsurance healthInsurance,
            final HealthInsuranceDTO healthInsuranceDTO) {
        healthInsuranceDTO.setId(healthInsurance.getId());
        healthInsuranceDTO.setNumber(healthInsurance.getNumber());
        healthInsuranceDTO.setType(healthInsurance.getType());
        healthInsuranceDTO.setPlan(healthInsurance.getPlan());
        healthInsuranceDTO.setCarrier(healthInsurance.getCarrier());
        healthInsuranceDTO.setActive(healthInsurance.getActive());
        healthInsuranceDTO.setDocuments(healthInsurance.getDocuments().stream()
                .map(document -> document.getId())
                .toList());
        return healthInsuranceDTO;
    }

    private HealthInsurance mapToEntity(final HealthInsuranceDTO healthInsuranceDTO,
            final HealthInsurance healthInsurance) {
        healthInsurance.setNumber(healthInsuranceDTO.getNumber());
        healthInsurance.setType(healthInsuranceDTO.getType());
        healthInsurance.setPlan(healthInsuranceDTO.getPlan());
        healthInsurance.setCarrier(healthInsuranceDTO.getCarrier());
        healthInsurance.setActive(healthInsuranceDTO.getActive());
        final List<Document> documents = documentRepository.findAllById(
                healthInsuranceDTO.getDocuments() == null ? List.of() : healthInsuranceDTO.getDocuments());
        if (documents.size() != (healthInsuranceDTO.getDocuments() == null ? 0 : healthInsuranceDTO.getDocuments().size())) {
            throw new NotFoundException("one of documents not found");
        }
        healthInsurance.setDocuments(new HashSet<>(documents));
        return healthInsurance;
    }

}
