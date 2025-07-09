package br.com.kontongroup.api.fabbrini.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AddressDTO {

    private Long id;

    @NotNull
    @Size(max = 255)
    private String address;

    @NotNull
    @Size(max = 20)
    private String cep;

    @Size(max = 255)
    private String complement;

    @NotNull
    @Size(max = 255)
    private String neighbourhood;

    private Integer number;

    @NotNull
    @Size(max = 255)
    private String city;

    @NotNull
    @Size(max = 255)
    private String uf;

    private Long user;

}
