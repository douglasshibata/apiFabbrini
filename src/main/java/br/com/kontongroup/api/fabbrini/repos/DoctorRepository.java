package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.Doctor;
import br.com.kontongroup.api.fabbrini.domain.Document;
import br.com.kontongroup.api.fabbrini.domain.HealthInsurance;
import br.com.kontongroup.api.fabbrini.domain.Specialty;
import br.com.kontongroup.api.fabbrini.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Doctor findFirstByUser(User user);

    Doctor findFirstBySpecialty(Specialty specialty);

    Doctor findFirstByHealthinsurances(HealthInsurance healthInsurance);

    Doctor findFirstByDocuments(Document document);

    List<Doctor> findAllByHealthinsurances(HealthInsurance healthInsurance);

    List<Doctor> findAllByDocuments(Document document);

    boolean existsByUserId(Long id);

}
