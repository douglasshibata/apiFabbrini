package br.com.kontongroup.api.fabbrini.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ResponsibleDTO {

    private Long id;

    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String degreeOfRelatedness;

    @NotNull
    private Long phones;

    @NotNull
    private Long patient;

}
