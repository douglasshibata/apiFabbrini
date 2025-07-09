package br.com.kontongroup.api.fabbrini.service;

import br.com.kontongroup.api.fabbrini.domain.Document;
import br.com.kontongroup.api.fabbrini.domain.HealthInsurance;
import br.com.kontongroup.api.fabbrini.domain.Patient;
import br.com.kontongroup.api.fabbrini.domain.Responsible;
import br.com.kontongroup.api.fabbrini.domain.Schedule;
import br.com.kontongroup.api.fabbrini.domain.User;
import br.com.kontongroup.api.fabbrini.model.PatientDTO;
import br.com.kontongroup.api.fabbrini.repos.DocumentRepository;
import br.com.kontongroup.api.fabbrini.repos.HealthInsuranceRepository;
import br.com.kontongroup.api.fabbrini.repos.PatientRepository;
import br.com.kontongroup.api.fabbrini.repos.ResponsibleRepository;
import br.com.kontongroup.api.fabbrini.repos.ScheduleRepository;
import br.com.kontongroup.api.fabbrini.repos.UserRepository;
import br.com.kontongroup.api.fabbrini.util.NotFoundException;
import br.com.kontongroup.api.fabbrini.util.ReferencedWarning;
import java.util.HashSet;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional(rollbackFor = Exception.class)
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final HealthInsuranceRepository healthInsuranceRepository;
    private final ResponsibleRepository responsibleRepository;
    private final ScheduleRepository scheduleRepository;

    public PatientService(final PatientRepository patientRepository,
            final UserRepository userRepository, final DocumentRepository documentRepository,
            final HealthInsuranceRepository healthInsuranceRepository,
            final ResponsibleRepository responsibleRepository,
            final ScheduleRepository scheduleRepository) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.documentRepository = documentRepository;
        this.healthInsuranceRepository = healthInsuranceRepository;
        this.responsibleRepository = responsibleRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public List<PatientDTO> findAll() {
        final List<Patient> patients = patientRepository.findAll(Sort.by("id"));
        return patients.stream()
                .map(patient -> mapToDTO(patient, new PatientDTO()))
                .toList();
    }

    public PatientDTO get(final Long id) {
        return patientRepository.findById(id)
                .map(patient -> mapToDTO(patient, new PatientDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final PatientDTO patientDTO) {
        final Patient patient = new Patient();
        mapToEntity(patientDTO, patient);
        return patientRepository.save(patient).getId();
    }

    public void update(final Long id, final PatientDTO patientDTO) {
        final Patient patient = patientRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(patientDTO, patient);
        patientRepository.save(patient);
    }

    public void delete(final Long id) {
        patientRepository.deleteById(id);
    }

    private PatientDTO mapToDTO(final Patient patient, final PatientDTO patientDTO) {
        patientDTO.setId(patient.getId());
        patientDTO.setFullname(patient.getFullname());
        patientDTO.setCpf(patient.getCpf());
        patientDTO.setRg(patient.getRg());
        patientDTO.setSocialname(patient.getSocialname());
        patientDTO.setUser(patient.getUser() == null ? null : patient.getUser().getId());
        patientDTO.setDocuments(patient.getDocuments().stream()
                .map(document -> document.getId())
                .toList());
        patientDTO.setHealthInsurances(patient.getHealthInsurances().stream()
                .map(healthInsurance -> healthInsurance.getId())
                .toList());
        return patientDTO;
    }

    private Patient mapToEntity(final PatientDTO patientDTO, final Patient patient) {
        patient.setFullname(patientDTO.getFullname());
        patient.setCpf(patientDTO.getCpf());
        patient.setRg(patientDTO.getRg());
        patient.setSocialname(patientDTO.getSocialname());
        final User user = patientDTO.getUser() == null ? null : userRepository.findById(patientDTO.getUser())
                .orElseThrow(() -> new NotFoundException("user not found"));
        patient.setUser(user);
        final List<Document> documents = documentRepository.findAllById(
                patientDTO.getDocuments() == null ? List.of() : patientDTO.getDocuments());
        if (documents.size() != (patientDTO.getDocuments() == null ? 0 : patientDTO.getDocuments().size())) {
            throw new NotFoundException("one of documents not found");
        }
        patient.setDocuments(new HashSet<>(documents));
        final List<HealthInsurance> healthInsurances = healthInsuranceRepository.findAllById(
                patientDTO.getHealthInsurances() == null ? List.of() : patientDTO.getHealthInsurances());
        if (healthInsurances.size() != (patientDTO.getHealthInsurances() == null ? 0 : patientDTO.getHealthInsurances().size())) {
            throw new NotFoundException("one of healthInsurances not found");
        }
        patient.setHealthInsurances(new HashSet<>(healthInsurances));
        return patient;
    }

    public boolean cpfExists(final String cpf) {
        return patientRepository.existsByCpfIgnoreCase(cpf);
    }

    public boolean userExists(final Long id) {
        return patientRepository.existsByUserId(id);
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Patient patient = patientRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Responsible patientResponsible = responsibleRepository.findFirstByPatient(patient);
        if (patientResponsible != null) {
            referencedWarning.setKey("patient.responsible.patient.referenced");
            referencedWarning.addParam(patientResponsible.getId());
            return referencedWarning;
        }
        final Schedule patientSchedule = scheduleRepository.findFirstByPatient(patient);
        if (patientSchedule != null) {
            referencedWarning.setKey("patient.schedule.patient.referenced");
            referencedWarning.addParam(patientSchedule.getId());
            return referencedWarning;
        }
        return null;
    }

}
