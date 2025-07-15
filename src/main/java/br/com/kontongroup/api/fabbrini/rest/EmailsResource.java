package br.com.kontongroup.api.fabbrini.rest;

import br.com.kontongroup.api.fabbrini.domain.Newsletter;
import br.com.kontongroup.api.fabbrini.model.EmailsDTO;
import br.com.kontongroup.api.fabbrini.repos.NewsletterRepository;
import br.com.kontongroup.api.fabbrini.service.EmailsService;
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
@RequestMapping(value = "/api/v1/emailss", produces = MediaType.APPLICATION_JSON_VALUE)
public class EmailsResource {

    private final EmailsService emailsService;
    private final NewsletterRepository newsletterRepository;

    public EmailsResource(final EmailsService emailsService,
            final NewsletterRepository newsletterRepository) {
        this.emailsService = emailsService;
        this.newsletterRepository = newsletterRepository;
    }

    @GetMapping
    public ResponseEntity<List<EmailsDTO>> getAllEmailss() {
        return ResponseEntity.ok(emailsService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmailsDTO> getEmails(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(emailsService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createEmails(@RequestBody @Valid final EmailsDTO emailsDTO) {
        final Long createdId = emailsService.create(emailsDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateEmails(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final EmailsDTO emailsDTO) {
        emailsService.update(id, emailsDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteEmails(@PathVariable(name = "id") final Long id) {
        emailsService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/newsletterValues")
    public ResponseEntity<Map<Long, Long>> getNewsletterValues() {
        return ResponseEntity.ok(newsletterRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Newsletter::getId, Newsletter::getId)));
    }

}
