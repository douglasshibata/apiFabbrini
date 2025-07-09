package br.com.kontongroup.api.fabbrini.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AlertDTO {

    private Long id;

    @NotNull
    private String description;

    @NotNull
    private LocalDateTime expirationTime;

    private Boolean active;

    @Size(max = 255)
    private String alertType;

}
