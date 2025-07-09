package br.com.kontongroup.api.fabbrini.model;

import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class DoctorDTO {

    private Long id;

    @Size(max = 255)
    private String conselho;

    @Size(max = 255)
    private String ufconselho;

    @Size(max = 255)
    private String registro;

    @Size(max = 255)
    private String title;

    @DoctorUserUnique
    private Long user;

    private Long specialty;

    private List<Long> healthinsurances;

    private List<Long> documents;

}
