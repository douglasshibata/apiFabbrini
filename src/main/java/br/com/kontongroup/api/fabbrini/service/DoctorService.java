package br.com.kontongroup.api.fabbrini.service;

import br.com.kontongroup.api.fabbrini.domain.Doctor;
import br.com.kontongroup.api.fabbrini.domain.DoctorsAvailableSchedule;
import br.com.kontongroup.api.fabbrini.domain.Document;
import br.com.kontongroup.api.fabbrini.domain.HealthInsurance;
import br.com.kontongroup.api.fabbrini.domain.Specialty;
import br.com.kontongroup.api.fabbrini.domain.User;
import br.com.kontongroup.api.fabbrini.model.DoctorDTO;
import br.com.kontongroup.api.fabbrini.repos.DoctorRepository;
import br.com.kontongroup.api.fabbrini.repos.DoctorsAvailableScheduleRepository;
import br.com.kontongroup.api.fabbrini.repos.DocumentRepository;
import br.com.kontongroup.api.fabbrini.repos.HealthInsuranceRepository;
import br.com.kontongroup.api.fabbrini.repos.SpecialtyRepository;
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
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final SpecialtyRepository specialtyRepository;
    private final HealthInsuranceRepository healthInsuranceRepository;
    private final DocumentRepository documentRepository;
    private final DoctorsAvailableScheduleRepository doctorsAvailableScheduleRepository;

    public DoctorService(final DoctorRepository doctorRepository,
            final UserRepository userRepository, final SpecialtyRepository specialtyRepository,
            final HealthInsuranceRepository healthInsuranceRepository,
            final DocumentRepository documentRepository,
            final DoctorsAvailableScheduleRepository doctorsAvailableScheduleRepository) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.specialtyRepository = specialtyRepository;
        this.healthInsuranceRepository = healthInsuranceRepository;
        this.documentRepository = documentRepository;
        this.doctorsAvailableScheduleRepository = doctorsAvailableScheduleRepository;
    }

    public List<DoctorDTO> findAll() {
        final List<Doctor> doctors = doctorRepository.findAll(Sort.by("id"));
        return doctors.stream()
                .map(doctor -> mapToDTO(doctor, new DoctorDTO()))
                .toList();
    }

    public DoctorDTO get(final Long id) {
        return doctorRepository.findById(id)
                .map(doctor -> mapToDTO(doctor, new DoctorDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final DoctorDTO doctorDTO) {
        final Doctor doctor = new Doctor();
        mapToEntity(doctorDTO, doctor);
        return doctorRepository.save(doctor).getId();
    }

    public void update(final Long id, final DoctorDTO doctorDTO) {
        final Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(doctorDTO, doctor);
        doctorRepository.save(doctor);
    }

    public void delete(final Long id) {
        doctorRepository.deleteById(id);
    }

    private DoctorDTO mapToDTO(final Doctor doctor, final DoctorDTO doctorDTO) {
        doctorDTO.setId(doctor.getId());
        doctorDTO.setConselho(doctor.getConselho());
        doctorDTO.setUfconselho(doctor.getUfconselho());
        doctorDTO.setRegistro(doctor.getRegistro());
        doctorDTO.setTitle(doctor.getTitle());
        doctorDTO.setUser(doctor.getUser() == null ? null : doctor.getUser().getId());
        doctorDTO.setSpecialty(doctor.getSpecialty() == null ? null : doctor.getSpecialty().getId());
        doctorDTO.setHealthinsurances(doctor.getHealthinsurances().stream()
                .map(healthInsurance -> healthInsurance.getId())
                .toList());
        doctorDTO.setDocuments(doctor.getDocuments().stream()
                .map(document -> document.getId())
                .toList());
        return doctorDTO;
    }

    private Doctor mapToEntity(final DoctorDTO doctorDTO, final Doctor doctor) {
        doctor.setConselho(doctorDTO.getConselho());
        doctor.setUfconselho(doctorDTO.getUfconselho());
        doctor.setRegistro(doctorDTO.getRegistro());
        doctor.setTitle(doctorDTO.getTitle());
        final User user = doctorDTO.getUser() == null ? null : userRepository.findById(doctorDTO.getUser())
                .orElseThrow(() -> new NotFoundException("user not found"));
        doctor.setUser(user);
        final Specialty specialty = doctorDTO.getSpecialty() == null ? null : specialtyRepository.findById(doctorDTO.getSpecialty())
                .orElseThrow(() -> new NotFoundException("specialty not found"));
        doctor.setSpecialty(specialty);
        final List<HealthInsurance> healthinsurances = healthInsuranceRepository.findAllById(
                doctorDTO.getHealthinsurances() == null ? List.of() : doctorDTO.getHealthinsurances());
        if (healthinsurances.size() != (doctorDTO.getHealthinsurances() == null ? 0 : doctorDTO.getHealthinsurances().size())) {
            throw new NotFoundException("one of healthinsurances not found");
        }
        doctor.setHealthinsurances(new HashSet<>(healthinsurances));
        final List<Document> documents = documentRepository.findAllById(
                doctorDTO.getDocuments() == null ? List.of() : doctorDTO.getDocuments());
        if (documents.size() != (doctorDTO.getDocuments() == null ? 0 : doctorDTO.getDocuments().size())) {
            throw new NotFoundException("one of documents not found");
        }
        doctor.setDocuments(new HashSet<>(documents));
        return doctor;
    }

    public boolean userExists(final Long id) {
        return doctorRepository.existsByUserId(id);
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final DoctorsAvailableSchedule doctorDoctorsAvailableSchedule = doctorsAvailableScheduleRepository.findFirstByDoctor(doctor);
        if (doctorDoctorsAvailableSchedule != null) {
            referencedWarning.setKey("doctor.doctorsAvailableSchedule.doctor.referenced");
            referencedWarning.addParam(doctorDoctorsAvailableSchedule.getId());
            return referencedWarning;
        }
        return null;
    }

}
