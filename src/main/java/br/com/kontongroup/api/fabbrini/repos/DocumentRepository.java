package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.Document;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DocumentRepository extends JpaRepository<Document, Long> {
}
