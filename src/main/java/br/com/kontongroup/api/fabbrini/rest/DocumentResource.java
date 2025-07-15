package br.com.kontongroup.api.fabbrini.rest;

import br.com.kontongroup.api.fabbrini.model.DocumentDTO;
import br.com.kontongroup.api.fabbrini.service.DocumentService;
import br.com.kontongroup.api.fabbrini.service.FileDataService;
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
@RequestMapping(value = "/api/v1/documents", produces = MediaType.APPLICATION_JSON_VALUE)
public class DocumentResource {

    private final DocumentService documentService;
    private final FileDataService fileDataService;

    public DocumentResource(final DocumentService documentService,
            final FileDataService fileDataService) {
        this.documentService = documentService;
        this.fileDataService = fileDataService;
    }

    @GetMapping
    public ResponseEntity<List<DocumentDTO>> getAllDocuments() {
        return ResponseEntity.ok(documentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentDTO> getDocument(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(documentService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createDocument(@RequestBody @Valid final DocumentDTO documentDTO) {
        final Long createdId = documentService.create(documentDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateDocument(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final DocumentDTO documentDTO) {
        documentService.update(id, documentDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteDocument(@PathVariable(name = "id") final Long id) {
        documentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/file/{filename}")
    public ResponseEntity<InputStreamResource> downloadFile(
            @PathVariable(name = "id") final Long id) {
        final DocumentDTO documentDTO = documentService.get(id);
        return fileDataService.provideDownload(documentDTO.getFile());
    }

}
