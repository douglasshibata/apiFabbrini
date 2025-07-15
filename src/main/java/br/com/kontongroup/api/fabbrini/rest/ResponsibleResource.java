package br.com.kontongroup.api.fabbrini.rest;

import br.com.kontongroup.api.fabbrini.domain.Patient;
import br.com.kontongroup.api.fabbrini.domain.Phones;
import br.com.kontongroup.api.fabbrini.model.ResponsibleDTO;
import br.com.kontongroup.api.fabbrini.repos.PatientRepository;
import br.com.kontongroup.api.fabbrini.repos.PhonesRepository;
import br.com.kontongroup.api.fabbrini.service.ResponsibleService;
import br.com.kontongroup.api.fabbrini.util.CustomCollectors;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api/v1/responsibles", produces = MediaType.APPLICATION_JSON_VALUE)
public class ResponsibleResource {

    private final ResponsibleService responsibleService;
    private final PhonesRepository phonesRepository;
    private final PatientRepository patientRepository;

    public ResponsibleResource(final ResponsibleService responsibleService,
            final PhonesRepository phonesRepository, final PatientRepository patientRepository) {
        this.responsibleService = responsibleService;
        this.phonesRepository = phonesRepository;
        this.patientRepository = patientRepository;
    }

    @GetMapping
    public ResponseEntity<List<ResponsibleDTO>> getAllResponsibles() {
        return ResponseEntity.ok(responsibleService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponsibleDTO> getResponsible(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(responsibleService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createResponsible(
            @RequestBody @Valid final ResponsibleDTO responsibleDTO) {
        final Long createdId = responsibleService.create(responsibleDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateResponsible(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final ResponsibleDTO responsibleDTO) {
        responsibleService.update(id, responsibleDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteResponsible(@PathVariable(name = "id") final Long id) {
        responsibleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/phonesValues")
    public ResponseEntity<Map<Long, Long>> getPhonesValues() {
        return ResponseEntity.ok(phonesRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Phones::getId, Phones::getId)));
    }

    @GetMapping("/patientValues")
    public ResponseEntity<Map<Long, String>> getPatientValues() {
        return ResponseEntity.ok(patientRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Patient::getId, Patient::getFullname)));
    }

}
