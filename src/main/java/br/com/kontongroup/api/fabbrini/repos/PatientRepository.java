package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.Document;
import br.com.kontongroup.api.fabbrini.domain.HealthInsurance;
import br.com.kontongroup.api.fabbrini.domain.Patient;
import br.com.kontongroup.api.fabbrini.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PatientRepository extends JpaRepository<Patient, Long> {

    Patient findFirstByUser(User user);

    Patient findFirstByDocuments(Document document);

    Patient findFirstByHealthInsurances(HealthInsurance healthInsurance);

    List<Patient> findAllByDocuments(Document document);

    List<Patient> findAllByHealthInsurances(HealthInsurance healthInsurance);

    boolean existsByCpfIgnoreCase(String cpf);

    boolean existsByUserId(Long id);

}
