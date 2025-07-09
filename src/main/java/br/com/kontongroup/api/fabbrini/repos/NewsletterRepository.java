package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.Newsletter;
import org.springframework.data.jpa.repository.JpaRepository;


public interface NewsletterRepository extends JpaRepository<Newsletter, Long> {
}
