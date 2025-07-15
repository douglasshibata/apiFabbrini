package br.com.kontongroup.api.fabbrini.rest;

import br.com.kontongroup.api.fabbrini.domain.Doctor;
import br.com.kontongroup.api.fabbrini.model.DoctorsAvailableScheduleDTO;
import br.com.kontongroup.api.fabbrini.repos.DoctorRepository;
import br.com.kontongroup.api.fabbrini.service.DoctorsAvailableScheduleService;
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
@RequestMapping(value = "/api/v1/v1/doctorsAvailableSchedules", produces = MediaType.APPLICATION_JSON_VALUE)
public class DoctorsAvailableScheduleResource {

    private final DoctorsAvailableScheduleService doctorsAvailableScheduleService;
    private final DoctorRepository doctorRepository;

    public DoctorsAvailableScheduleResource(
            final DoctorsAvailableScheduleService doctorsAvailableScheduleService,
            final DoctorRepository doctorRepository) {
        this.doctorsAvailableScheduleService = doctorsAvailableScheduleService;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public ResponseEntity<List<DoctorsAvailableScheduleDTO>> getAllDoctorsAvailableSchedules() {
        return ResponseEntity.ok(doctorsAvailableScheduleService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorsAvailableScheduleDTO> getDoctorsAvailableSchedule(
            @PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(doctorsAvailableScheduleService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createDoctorsAvailableSchedule(
            @RequestBody @Valid final DoctorsAvailableScheduleDTO doctorsAvailableScheduleDTO) {
        final Long createdId = doctorsAvailableScheduleService.create(doctorsAvailableScheduleDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateDoctorsAvailableSchedule(
            @PathVariable(name = "id") final Long id,
            @RequestBody @Valid final DoctorsAvailableScheduleDTO doctorsAvailableScheduleDTO) {
        doctorsAvailableScheduleService.update(id, doctorsAvailableScheduleDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteDoctorsAvailableSchedule(
            @PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = doctorsAvailableScheduleService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        doctorsAvailableScheduleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/doctorValues")
    public ResponseEntity<Map<Long, Long>> getDoctorValues() {
        return ResponseEntity.ok(doctorRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Doctor::getId, Doctor::getId)));
    }

}
