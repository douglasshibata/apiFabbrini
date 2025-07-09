package br.com.kontongroup.api.fabbrini.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PatientDTO {

    private Long id;

    @NotNull
    @Size(max = 255)
    private String fullname;

    @Size(max = 255)
    @PatientCpfUnique
    private String cpf;

    @Size(max = 255)
    private String rg;

    @Size(max = 255)
    private String socialname;

    @NotNull
    @PatientUserUnique
    private Long user;

    private List<Long> documents;

    private List<Long> healthInsurances;

}
