package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.PasswordToken;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PasswordTokenRepository extends JpaRepository<PasswordToken, Long> {
}
