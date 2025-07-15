package br.com.kontongroup.api.fabbrini.rest;

import br.com.kontongroup.api.fabbrini.domain.Document;
import br.com.kontongroup.api.fabbrini.model.HealthInsuranceDTO;
import br.com.kontongroup.api.fabbrini.repos.DocumentRepository;
import br.com.kontongroup.api.fabbrini.service.HealthInsuranceService;
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
@RequestMapping(value = "/api/v1/v1/v1/healthInsurances", produces = MediaType.APPLICATION_JSON_VALUE)
public class HealthInsuranceResource {

    private final HealthInsuranceService healthInsuranceService;
    private final DocumentRepository documentRepository;

    public HealthInsuranceResource(final HealthInsuranceService healthInsuranceService,
            final DocumentRepository documentRepository) {
        this.healthInsuranceService = healthInsuranceService;
        this.documentRepository = documentRepository;
    }

    @GetMapping
    public ResponseEntity<List<HealthInsuranceDTO>> getAllHealthInsurances() {
        return ResponseEntity.ok(healthInsuranceService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HealthInsuranceDTO> getHealthInsurance(
            @PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(healthInsuranceService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createHealthInsurance(
            @RequestBody @Valid final HealthInsuranceDTO healthInsuranceDTO) {
        final Long createdId = healthInsuranceService.create(healthInsuranceDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateHealthInsurance(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final HealthInsuranceDTO healthInsuranceDTO) {
        healthInsuranceService.update(id, healthInsuranceDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteHealthInsurance(@PathVariable(name = "id") final Long id) {
        healthInsuranceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/documentsValues")
    public ResponseEntity<Map<Long, Long>> getDocumentsValues() {
        return ResponseEntity.ok(documentRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Document::getId, Document::getId)));
    }

}
