package br.com.kontongroup.api.fabbrini.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class HealthInsuranceDTO {

    private Long id;

    @NotNull
    @Size(max = 255)
    private String number;

    @Size(max = 255)
    private String type;

    @Size(max = 255)
    private String plan;

    @Size(max = 255)
    private String carrier;

    private Boolean active;

    private List<Long> documents;

}
