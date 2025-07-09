package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.Emails;
import br.com.kontongroup.api.fabbrini.domain.Newsletter;
import org.springframework.data.jpa.repository.JpaRepository;


public interface EmailsRepository extends JpaRepository<Emails, Long> {

    Emails findFirstByNewsletter(Newsletter newsletter);

}
