package br.com.kontongroup.api.fabbrini.model;

import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PasswordTokenDTO {

    private Long id;

    private UUID token;

    private LocalDateTime expirationTime;

    @Size(max = 255)
    private String typeToken;

    private Boolean used;

}
