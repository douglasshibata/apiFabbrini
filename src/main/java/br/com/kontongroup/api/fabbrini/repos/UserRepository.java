package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.Role;
import br.com.kontongroup.api.fabbrini.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {

    User findFirstByRole(Role role);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByCpfIgnoreCase(String cpf);

    boolean existsByRoleId(Long id);

}
