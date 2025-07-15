package br.com.kontongroup.api.fabbrini.rest;

import br.com.kontongroup.api.fabbrini.domain.Document;
import br.com.kontongroup.api.fabbrini.domain.HealthInsurance;
import br.com.kontongroup.api.fabbrini.domain.Specialty;
import br.com.kontongroup.api.fabbrini.domain.User;
import br.com.kontongroup.api.fabbrini.model.DoctorDTO;
import br.com.kontongroup.api.fabbrini.repos.DocumentRepository;
import br.com.kontongroup.api.fabbrini.repos.HealthInsuranceRepository;
import br.com.kontongroup.api.fabbrini.repos.SpecialtyRepository;
import br.com.kontongroup.api.fabbrini.repos.UserRepository;
import br.com.kontongroup.api.fabbrini.service.DoctorService;
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
@RequestMapping(value = "/api/v1/doctors", produces = MediaType.APPLICATION_JSON_VALUE)
public class DoctorResource {

    private final DoctorService doctorService;
    private final UserRepository userRepository;
    private final SpecialtyRepository specialtyRepository;
    private final HealthInsuranceRepository healthInsuranceRepository;
    private final DocumentRepository documentRepository;

    public DoctorResource(final DoctorService doctorService, final UserRepository userRepository,
            final SpecialtyRepository specialtyRepository,
            final HealthInsuranceRepository healthInsuranceRepository,
            final DocumentRepository documentRepository) {
        this.doctorService = doctorService;
        this.userRepository = userRepository;
        this.specialtyRepository = specialtyRepository;
        this.healthInsuranceRepository = healthInsuranceRepository;
        this.documentRepository = documentRepository;
    }

    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctor(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(doctorService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createDoctor(@RequestBody @Valid final DoctorDTO doctorDTO) {
        final Long createdId = doctorService.create(doctorDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateDoctor(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final DoctorDTO doctorDTO) {
        doctorService.update(id, doctorDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteDoctor(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = doctorService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        doctorService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/userValues")
    public ResponseEntity<Map<Long, String>> getUserValues() {
        return ResponseEntity.ok(userRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(User::getId, User::getEmail)));
    }

    @GetMapping("/specialtyValues")
    public ResponseEntity<Map<Long, String>> getSpecialtyValues() {
        return ResponseEntity.ok(specialtyRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Specialty::getId, Specialty::getName)));
    }

    @GetMapping("/healthinsurancesValues")
    public ResponseEntity<Map<Long, String>> getHealthinsurancesValues() {
        return ResponseEntity.ok(healthInsuranceRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(HealthInsurance::getId, HealthInsurance::getNumber)));
    }

    @GetMapping("/documentsValues")
    public ResponseEntity<Map<Long, Long>> getDocumentsValues() {
        return ResponseEntity.ok(documentRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Document::getId, Document::getId)));
    }

}
