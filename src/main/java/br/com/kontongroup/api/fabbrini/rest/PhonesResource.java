package br.com.kontongroup.api.fabbrini.rest;

import br.com.kontongroup.api.fabbrini.domain.User;
import br.com.kontongroup.api.fabbrini.model.PhonesDTO;
import br.com.kontongroup.api.fabbrini.repos.UserRepository;
import br.com.kontongroup.api.fabbrini.service.PhonesService;
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
@RequestMapping(value = "/api/v1/v1/phoness", produces = MediaType.APPLICATION_JSON_VALUE)
public class PhonesResource {

    private final PhonesService phonesService;
    private final UserRepository userRepository;

    public PhonesResource(final PhonesService phonesService, final UserRepository userRepository) {
        this.phonesService = phonesService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<PhonesDTO>> getAllPhoness() {
        return ResponseEntity.ok(phonesService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhonesDTO> getPhones(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(phonesService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createPhones(@RequestBody @Valid final PhonesDTO phonesDTO) {
        final Long createdId = phonesService.create(phonesDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updatePhones(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final PhonesDTO phonesDTO) {
        phonesService.update(id, phonesDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deletePhones(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = phonesService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        phonesService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/userValues")
    public ResponseEntity<Map<Long, String>> getUserValues() {
        return ResponseEntity.ok(userRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(User::getId, User::getEmail)));
    }

}
