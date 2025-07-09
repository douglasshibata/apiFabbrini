package br.com.kontongroup.api.fabbrini.model;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PhonesDTO {

    private Long id;

    @Size(max = 4)
    private String ddd;

    @Size(max = 40)
    private String number;

    private Long user;

}
