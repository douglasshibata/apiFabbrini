package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.Doctor;
import br.com.kontongroup.api.fabbrini.domain.DoctorsAvailableSchedule;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DoctorsAvailableScheduleRepository extends JpaRepository<DoctorsAvailableSchedule, Long> {

    DoctorsAvailableSchedule findFirstByDoctor(Doctor doctor);

}
