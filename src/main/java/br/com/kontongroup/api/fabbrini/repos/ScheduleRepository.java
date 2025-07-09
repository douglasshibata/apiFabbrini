package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.DoctorsAvailableSchedule;
import br.com.kontongroup.api.fabbrini.domain.Patient;
import br.com.kontongroup.api.fabbrini.domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    Schedule findFirstByPatient(Patient patient);

    Schedule findFirstByDoctorsAvailableSchedule(DoctorsAvailableSchedule doctorsAvailableSchedule);

}
