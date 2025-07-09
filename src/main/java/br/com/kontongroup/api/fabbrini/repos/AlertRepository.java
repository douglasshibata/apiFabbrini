package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.Alert;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AlertRepository extends JpaRepository<Alert, Long> {
}
