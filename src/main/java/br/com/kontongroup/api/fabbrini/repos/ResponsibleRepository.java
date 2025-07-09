package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.Patient;
import br.com.kontongroup.api.fabbrini.domain.Phones;
import br.com.kontongroup.api.fabbrini.domain.Responsible;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResponsibleRepository extends JpaRepository<Responsible, Long> {

    Responsible findFirstByPhones(Phones phones);

    Responsible findFirstByPatient(Patient patient);

}
