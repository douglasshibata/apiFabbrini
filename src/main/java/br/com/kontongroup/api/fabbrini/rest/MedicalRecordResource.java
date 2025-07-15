package br.com.kontongroup.api.fabbrini.rest;

import br.com.kontongroup.api.fabbrini.domain.Schedule;
import br.com.kontongroup.api.fabbrini.model.MedicalRecordDTO;
import br.com.kontongroup.api.fabbrini.repos.ScheduleRepository;
import br.com.kontongroup.api.fabbrini.service.MedicalRecordService;
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
@RequestMapping(value = "/api/v1/medicalRecords", produces = MediaType.APPLICATION_JSON_VALUE)
public class MedicalRecordResource {

    private final MedicalRecordService medicalRecordService;
    private final ScheduleRepository scheduleRepository;

    public MedicalRecordResource(final MedicalRecordService medicalRecordService,
            final ScheduleRepository scheduleRepository) {
        this.medicalRecordService = medicalRecordService;
        this.scheduleRepository = scheduleRepository;
    }

    @GetMapping
    public ResponseEntity<List<MedicalRecordDTO>> getAllMedicalRecords() {
        return ResponseEntity.ok(medicalRecordService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecordDTO> getMedicalRecord(
            @PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(medicalRecordService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createMedicalRecord(
            @RequestBody @Valid final MedicalRecordDTO medicalRecordDTO) {
        final Long createdId = medicalRecordService.create(medicalRecordDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateMedicalRecord(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final MedicalRecordDTO medicalRecordDTO) {
        medicalRecordService.update(id, medicalRecordDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable(name = "id") final Long id) {
        medicalRecordService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/scheduleValues")
    public ResponseEntity<Map<Long, Long>> getScheduleValues() {
        return ResponseEntity.ok(scheduleRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Schedule::getId, Schedule::getId)));
    }

}
