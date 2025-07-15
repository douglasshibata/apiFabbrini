package br.com.kontongroup.api.fabbrini.rest;

import br.com.kontongroup.api.fabbrini.model.NewsletterDTO;
import br.com.kontongroup.api.fabbrini.service.FileDataService;
import br.com.kontongroup.api.fabbrini.service.NewsletterService;
import br.com.kontongroup.api.fabbrini.util.ReferencedException;
import br.com.kontongroup.api.fabbrini.util.ReferencedWarning;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.core.io.InputStreamResource;
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
@RequestMapping(value = "/api/v1/newsletters", produces = MediaType.APPLICATION_JSON_VALUE)
public class NewsletterResource {

    private final NewsletterService newsletterService;
    private final FileDataService fileDataService;

    public NewsletterResource(final NewsletterService newsletterService,
            final FileDataService fileDataService) {
        this.newsletterService = newsletterService;
        this.fileDataService = fileDataService;
    }

    @GetMapping
    public ResponseEntity<List<NewsletterDTO>> getAllNewsletters() {
        return ResponseEntity.ok(newsletterService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsletterDTO> getNewsletter(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(newsletterService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createNewsletter(
            @RequestBody @Valid final NewsletterDTO newsletterDTO) {
        final Long createdId = newsletterService.create(newsletterDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateNewsletter(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final NewsletterDTO newsletterDTO) {
        newsletterService.update(id, newsletterDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteNewsletter(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = newsletterService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        newsletterService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/file/{filename}")
    public ResponseEntity<InputStreamResource> downloadFile(
            @PathVariable(name = "id") final Long id) {
        final NewsletterDTO newsletterDTO = newsletterService.get(id);
        return fileDataService.provideDownload(newsletterDTO.getFile());
    }

}
