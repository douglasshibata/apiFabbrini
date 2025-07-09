package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SpecialtyRepository extends JpaRepository<Specialty, Long> {
}
