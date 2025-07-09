package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.MedicalRecord;
import br.com.kontongroup.api.fabbrini.domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    MedicalRecord findFirstBySchedule(Schedule schedule);

    boolean existsByScheduleId(Long id);

}
