package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.FileContent;
import org.springframework.data.jpa.repository.JpaRepository;


public interface FileContentRepository extends JpaRepository<FileContent, String> {
}
