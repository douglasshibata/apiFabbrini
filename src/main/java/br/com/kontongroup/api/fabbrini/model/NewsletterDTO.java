package br.com.kontongroup.api.fabbrini.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class NewsletterDTO {

    private Long id;

    @Size(max = 255)
    private String title;

    private String content;

    @Valid
    @ValidFileType({"pdf", "jpg", "jpeg", "png"})
    private FileData file;

    @NotNull
    private LocalDateTime deliveryDate;

}
