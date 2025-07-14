package br.com.kontongroup.api.fabbrini.model;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class RoleDTO {

    private Long id;

    @NotNull
    @RoleTypeUnique
    private RoleType type;

}
