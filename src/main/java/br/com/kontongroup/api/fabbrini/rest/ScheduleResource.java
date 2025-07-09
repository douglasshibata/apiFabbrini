package br.com.kontongroup.api.fabbrini.rest;

import br.com.kontongroup.api.fabbrini.domain.DoctorsAvailableSchedule;
import br.com.kontongroup.api.fabbrini.domain.Patient;
import br.com.kontongroup.api.fabbrini.model.ScheduleDTO;
import br.com.kontongroup.api.fabbrini.repos.DoctorsAvailableScheduleRepository;
import br.com.kontongroup.api.fabbrini.repos.PatientRepository;
import br.com.kontongroup.api.fabbrini.service.ScheduleService;
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
@RequestMapping(value = "/api/schedules", produces = MediaType.APPLICATION_JSON_VALUE)
public class ScheduleResource {

    private final ScheduleService scheduleService;
    private final PatientRepository patientRepository;
    private final DoctorsAvailableScheduleRepository doctorsAvailableScheduleRepository;

    public ScheduleResource(final ScheduleService scheduleService,
            final PatientRepository patientRepository,
            final DoctorsAvailableScheduleRepository doctorsAvailableScheduleRepository) {
        this.scheduleService = scheduleService;
        this.patientRepository = patientRepository;
        this.doctorsAvailableScheduleRepository = doctorsAvailableScheduleRepository;
    }

    @GetMapping
    public ResponseEntity<List<ScheduleDTO>> getAllSchedules() {
        return ResponseEntity.ok(scheduleService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleDTO> getSchedule(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(scheduleService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createSchedule(@RequestBody @Valid final ScheduleDTO scheduleDTO) {
        final Long createdId = scheduleService.create(scheduleDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateSchedule(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final ScheduleDTO scheduleDTO) {
        scheduleService.update(id, scheduleDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteSchedule(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = scheduleService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        scheduleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patientValues")
    public ResponseEntity<Map<Long, String>> getPatientValues() {
        return ResponseEntity.ok(patientRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Patient::getId, Patient::getFullname)));
    }

    @GetMapping("/doctorsAvailableScheduleValues")
    public ResponseEntity<Map<Long, Long>> getDoctorsAvailableScheduleValues() {
        return ResponseEntity.ok(doctorsAvailableScheduleRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(DoctorsAvailableSchedule::getId, DoctorsAvailableSchedule::getId)));
    }

}
