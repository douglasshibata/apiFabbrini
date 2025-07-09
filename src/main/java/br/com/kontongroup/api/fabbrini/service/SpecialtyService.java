package br.com.kontongroup.api.fabbrini.service;

import br.com.kontongroup.api.fabbrini.domain.Doctor;
import br.com.kontongroup.api.fabbrini.domain.Specialty;
import br.com.kontongroup.api.fabbrini.model.SpecialtyDTO;
import br.com.kontongroup.api.fabbrini.repos.DoctorRepository;
import br.com.kontongroup.api.fabbrini.repos.SpecialtyRepository;
import br.com.kontongroup.api.fabbrini.util.NotFoundException;
import br.com.kontongroup.api.fabbrini.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class SpecialtyService {

    private final SpecialtyRepository specialtyRepository;
    private final DoctorRepository doctorRepository;

    public SpecialtyService(final SpecialtyRepository specialtyRepository,
            final DoctorRepository doctorRepository) {
        this.specialtyRepository = specialtyRepository;
        this.doctorRepository = doctorRepository;
    }

    public List<SpecialtyDTO> findAll() {
        final List<Specialty> specialties = specialtyRepository.findAll(Sort.by("id"));
        return specialties.stream()
                .map(specialty -> mapToDTO(specialty, new SpecialtyDTO()))
                .toList();
    }

    public SpecialtyDTO get(final Long id) {
        return specialtyRepository.findById(id)
                .map(specialty -> mapToDTO(specialty, new SpecialtyDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final SpecialtyDTO specialtyDTO) {
        final Specialty specialty = new Specialty();
        mapToEntity(specialtyDTO, specialty);
        return specialtyRepository.save(specialty).getId();
    }

    public void update(final Long id, final SpecialtyDTO specialtyDTO) {
        final Specialty specialty = specialtyRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(specialtyDTO, specialty);
        specialtyRepository.save(specialty);
    }

    public void delete(final Long id) {
        specialtyRepository.deleteById(id);
    }

    private SpecialtyDTO mapToDTO(final Specialty specialty, final SpecialtyDTO specialtyDTO) {
        specialtyDTO.setId(specialty.getId());
        specialtyDTO.setName(specialty.getName());
        specialtyDTO.setDescription(specialty.getDescription());
        return specialtyDTO;
    }

    private Specialty mapToEntity(final SpecialtyDTO specialtyDTO, final Specialty specialty) {
        specialty.setName(specialtyDTO.getName());
        specialty.setDescription(specialtyDTO.getDescription());
        return specialty;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Specialty specialty = specialtyRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Doctor specialtyDoctor = doctorRepository.findFirstBySpecialty(specialty);
        if (specialtyDoctor != null) {
            referencedWarning.setKey("specialty.doctor.specialty.referenced");
            referencedWarning.addParam(specialtyDoctor.getId());
            return referencedWarning;
        }
        return null;
    }

}
