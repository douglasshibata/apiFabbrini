package br.com.kontongroup.api.fabbrini.rest;

import br.com.kontongroup.api.fabbrini.model.PasswordTokenDTO;
import br.com.kontongroup.api.fabbrini.service.PasswordTokenService;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
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
@RequestMapping(value = "/api/v1/v1/passwordTokens", produces = MediaType.APPLICATION_JSON_VALUE)
public class PasswordTokenResource {

    private final PasswordTokenService passwordTokenService;

    public PasswordTokenResource(final PasswordTokenService passwordTokenService) {
        this.passwordTokenService = passwordTokenService;
    }

    @GetMapping
    public ResponseEntity<List<PasswordTokenDTO>> getAllPasswordTokens() {
        return ResponseEntity.ok(passwordTokenService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PasswordTokenDTO> getPasswordToken(
            @PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(passwordTokenService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createPasswordToken(
            @RequestBody @Valid final PasswordTokenDTO passwordTokenDTO) {
        final Long createdId = passwordTokenService.create(passwordTokenDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updatePasswordToken(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final PasswordTokenDTO passwordTokenDTO) {
        passwordTokenService.update(id, passwordTokenDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deletePasswordToken(@PathVariable(name = "id") final Long id) {
        passwordTokenService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
