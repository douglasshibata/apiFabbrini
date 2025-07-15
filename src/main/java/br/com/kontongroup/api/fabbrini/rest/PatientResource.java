package br.com.kontongroup.api.fabbrini.rest;

import br.com.kontongroup.api.fabbrini.domain.Document;
import br.com.kontongroup.api.fabbrini.domain.HealthInsurance;
import br.com.kontongroup.api.fabbrini.domain.User;
import br.com.kontongroup.api.fabbrini.model.PatientDTO;
import br.com.kontongroup.api.fabbrini.repos.DocumentRepository;
import br.com.kontongroup.api.fabbrini.repos.HealthInsuranceRepository;
import br.com.kontongroup.api.fabbrini.repos.UserRepository;
import br.com.kontongroup.api.fabbrini.service.PatientService;
import br.com.kontongroup.api.fabbrini.util.CustomCollectors;
import br.com.kontongroup.api.fabbrini.util.ReferencedException;
import br.com.kontongroup.api.fabbrini.util.ReferencedWarning;
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
@RequestMapping(value = "/api/v1/v1/patients", produces = MediaType.APPLICATION_JSON_VALUE)
public class PatientResource {

    private final PatientService patientService;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final HealthInsuranceRepository healthInsuranceRepository;

    public PatientResource(final PatientService patientService, final UserRepository userRepository,
            final DocumentRepository documentRepository,
            final HealthInsuranceRepository healthInsuranceRepository) {
        this.patientService = patientService;
        this.userRepository = userRepository;
        this.documentRepository = documentRepository;
        this.healthInsuranceRepository = healthInsuranceRepository;
    }

    @GetMapping
    public ResponseEntity<List<PatientDTO>> getAllPatients() {
        return ResponseEntity.ok(patientService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatient(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(patientService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createPatient(@RequestBody @Valid final PatientDTO patientDTO) {
        final Long createdId = patientService.create(patientDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updatePatient(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final PatientDTO patientDTO) {
        patientService.update(id, patientDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deletePatient(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = patientService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        patientService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/userValues")
    public ResponseEntity<Map<Long, String>> getUserValues() {
        return ResponseEntity.ok(userRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(User::getId, User::getEmail)));
    }

    @GetMapping("/documentsValues")
    public ResponseEntity<Map<Long, Long>> getDocumentsValues() {
        return ResponseEntity.ok(documentRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Document::getId, Document::getId)));
    }

    @GetMapping("/healthInsurancesValues")
    public ResponseEntity<Map<Long, String>> getHealthInsurancesValues() {
        return ResponseEntity.ok(healthInsuranceRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(HealthInsurance::getId, HealthInsurance::getNumber)));
    }

}
