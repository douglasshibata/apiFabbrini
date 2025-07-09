package br.com.kontongroup.api.fabbrini.service;

import br.com.kontongroup.api.fabbrini.domain.Patient;
import br.com.kontongroup.api.fabbrini.domain.Phones;
import br.com.kontongroup.api.fabbrini.domain.Responsible;
import br.com.kontongroup.api.fabbrini.model.ResponsibleDTO;
import br.com.kontongroup.api.fabbrini.repos.PatientRepository;
import br.com.kontongroup.api.fabbrini.repos.PhonesRepository;
import br.com.kontongroup.api.fabbrini.repos.ResponsibleRepository;
import br.com.kontongroup.api.fabbrini.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ResponsibleService {

    private final ResponsibleRepository responsibleRepository;
    private final PhonesRepository phonesRepository;
    private final PatientRepository patientRepository;

    public ResponsibleService(final ResponsibleRepository responsibleRepository,
            final PhonesRepository phonesRepository, final PatientRepository patientRepository) {
        this.responsibleRepository = responsibleRepository;
        this.phonesRepository = phonesRepository;
        this.patientRepository = patientRepository;
    }

    public List<ResponsibleDTO> findAll() {
        final List<Responsible> responsibles = responsibleRepository.findAll(Sort.by("id"));
        return responsibles.stream()
                .map(responsible -> mapToDTO(responsible, new ResponsibleDTO()))
                .toList();
    }

    public ResponsibleDTO get(final Long id) {
        return responsibleRepository.findById(id)
                .map(responsible -> mapToDTO(responsible, new ResponsibleDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final ResponsibleDTO responsibleDTO) {
        final Responsible responsible = new Responsible();
        mapToEntity(responsibleDTO, responsible);
        return responsibleRepository.save(responsible).getId();
    }

    public void update(final Long id, final ResponsibleDTO responsibleDTO) {
        final Responsible responsible = responsibleRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(responsibleDTO, responsible);
        responsibleRepository.save(responsible);
    }

    public void delete(final Long id) {
        responsibleRepository.deleteById(id);
    }

    private ResponsibleDTO mapToDTO(final Responsible responsible,
            final ResponsibleDTO responsibleDTO) {
        responsibleDTO.setId(responsible.getId());
        responsibleDTO.setName(responsible.getName());
        responsibleDTO.setDegreeOfRelatedness(responsible.getDegreeOfRelatedness());
        responsibleDTO.setPhones(responsible.getPhones() == null ? null : responsible.getPhones().getId());
        responsibleDTO.setPatient(responsible.getPatient() == null ? null : responsible.getPatient().getId());
        return responsibleDTO;
    }

    private Responsible mapToEntity(final ResponsibleDTO responsibleDTO,
            final Responsible responsible) {
        responsible.setName(responsibleDTO.getName());
        responsible.setDegreeOfRelatedness(responsibleDTO.getDegreeOfRelatedness());
        final Phones phones = responsibleDTO.getPhones() == null ? null : phonesRepository.findById(responsibleDTO.getPhones())
                .orElseThrow(() -> new NotFoundException("phones not found"));
        responsible.setPhones(phones);
        final Patient patient = responsibleDTO.getPatient() == null ? null : patientRepository.findById(responsibleDTO.getPatient())
                .orElseThrow(() -> new NotFoundException("patient not found"));
        responsible.setPatient(patient);
        return responsible;
    }

}
