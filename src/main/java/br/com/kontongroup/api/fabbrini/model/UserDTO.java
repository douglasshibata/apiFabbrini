package br.com.kontongroup.api.fabbrini.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class UserDTO {

    private Long id;

    @NotNull
    @Size(max = 255)
    @UserEmailUnique
    private String email;

    @NotNull
    @Size(max = 255)
    private String password;

    @NotNull
    @Size(max = 255)
    private String fullname;

    private Boolean active;

    @Size(max = 255)
    private String socialname;

    @NotNull
    @Size(max = 255)
    @UserCpfUnique
    private String cpf;

    @Size(max = 255)
    private String crm;

    private Long countAccess;

    @UserRoleUnique
    private Long role;

}
