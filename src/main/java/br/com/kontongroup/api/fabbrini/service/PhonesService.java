package br.com.kontongroup.api.fabbrini.service;

import br.com.kontongroup.api.fabbrini.domain.Phones;
import br.com.kontongroup.api.fabbrini.domain.Responsible;
import br.com.kontongroup.api.fabbrini.domain.User;
import br.com.kontongroup.api.fabbrini.model.PhonesDTO;
import br.com.kontongroup.api.fabbrini.repos.PhonesRepository;
import br.com.kontongroup.api.fabbrini.repos.ResponsibleRepository;
import br.com.kontongroup.api.fabbrini.repos.UserRepository;
import br.com.kontongroup.api.fabbrini.util.NotFoundException;
import br.com.kontongroup.api.fabbrini.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class PhonesService {

    private final PhonesRepository phonesRepository;
    private final UserRepository userRepository;
    private final ResponsibleRepository responsibleRepository;

    public PhonesService(final PhonesRepository phonesRepository,
            final UserRepository userRepository,
            final ResponsibleRepository responsibleRepository) {
        this.phonesRepository = phonesRepository;
        this.userRepository = userRepository;
        this.responsibleRepository = responsibleRepository;
    }

    public List<PhonesDTO> findAll() {
        final List<Phones> phoneses = phonesRepository.findAll(Sort.by("id"));
        return phoneses.stream()
                .map(phones -> mapToDTO(phones, new PhonesDTO()))
                .toList();
    }

    public PhonesDTO get(final Long id) {
        return phonesRepository.findById(id)
                .map(phones -> mapToDTO(phones, new PhonesDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final PhonesDTO phonesDTO) {
        final Phones phones = new Phones();
        mapToEntity(phonesDTO, phones);
        return phonesRepository.save(phones).getId();
    }

    public void update(final Long id, final PhonesDTO phonesDTO) {
        final Phones phones = phonesRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(phonesDTO, phones);
        phonesRepository.save(phones);
    }

    public void delete(final Long id) {
        phonesRepository.deleteById(id);
    }

    private PhonesDTO mapToDTO(final Phones phones, final PhonesDTO phonesDTO) {
        phonesDTO.setId(phones.getId());
        phonesDTO.setDdd(phones.getDdd());
        phonesDTO.setNumber(phones.getNumber());
        phonesDTO.setUser(phones.getUser() == null ? null : phones.getUser().getId());
        return phonesDTO;
    }

    private Phones mapToEntity(final PhonesDTO phonesDTO, final Phones phones) {
        phones.setDdd(phonesDTO.getDdd());
        phones.setNumber(phonesDTO.getNumber());
        final User user = phonesDTO.getUser() == null ? null : userRepository.findById(phonesDTO.getUser())
                .orElseThrow(() -> new NotFoundException("user not found"));
        phones.setUser(user);
        return phones;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Phones phones = phonesRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Responsible phonesResponsible = responsibleRepository.findFirstByPhones(phones);
        if (phonesResponsible != null) {
            referencedWarning.setKey("phones.responsible.phones.referenced");
            referencedWarning.addParam(phonesResponsible.getId());
            return referencedWarning;
        }
        return null;
    }

}
