package br.com.kontongroup.api.fabbrini.model;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class EmailsDTO {

    private Long id;

    @Size(max = 255)
    private String email;

    private Boolean active;

    private Long newsletter;

}
