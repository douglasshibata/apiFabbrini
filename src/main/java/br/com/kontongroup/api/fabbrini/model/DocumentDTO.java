package br.com.kontongroup.api.fabbrini.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class DocumentDTO {

    private Long id;

    @NotNull
    private DocumentType documentType;

    @NotNull
    @Valid
    @ValidFileType({"jpeg", "pdf", "jpg", "png"})
    private FileData file;

    @Size(max = 255)
    private String filename;

    @Size(max = 255)
    private String fileType;

}
