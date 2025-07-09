package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.Phones;
import br.com.kontongroup.api.fabbrini.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PhonesRepository extends JpaRepository<Phones, Long> {

    Phones findFirstByUser(User user);

}
