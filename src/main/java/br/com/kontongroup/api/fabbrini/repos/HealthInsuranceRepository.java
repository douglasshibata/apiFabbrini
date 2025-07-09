package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.Document;
import br.com.kontongroup.api.fabbrini.domain.HealthInsurance;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HealthInsuranceRepository extends JpaRepository<HealthInsurance, Long> {

    HealthInsurance findFirstByDocuments(Document document);

    List<HealthInsurance> findAllByDocuments(Document document);

}
