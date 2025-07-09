package br.com.kontongroup.api.fabbrini.service;

import br.com.kontongroup.api.fabbrini.domain.MedicalRecord;
import br.com.kontongroup.api.fabbrini.domain.Schedule;
import br.com.kontongroup.api.fabbrini.model.MedicalRecordDTO;
import br.com.kontongroup.api.fabbrini.repos.MedicalRecordRepository;
import br.com.kontongroup.api.fabbrini.repos.ScheduleRepository;
import br.com.kontongroup.api.fabbrini.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final ScheduleRepository scheduleRepository;

    public MedicalRecordService(final MedicalRecordRepository medicalRecordRepository,
            final ScheduleRepository scheduleRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public List<MedicalRecordDTO> findAll() {
        final List<MedicalRecord> medicalRecords = medicalRecordRepository.findAll(Sort.by("id"));
        return medicalRecords.stream()
                .map(medicalRecord -> mapToDTO(medicalRecord, new MedicalRecordDTO()))
                .toList();
    }

    public MedicalRecordDTO get(final Long id) {
        return medicalRecordRepository.findById(id)
                .map(medicalRecord -> mapToDTO(medicalRecord, new MedicalRecordDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final MedicalRecordDTO medicalRecordDTO) {
        final MedicalRecord medicalRecord = new MedicalRecord();
        mapToEntity(medicalRecordDTO, medicalRecord);
        return medicalRecordRepository.save(medicalRecord).getId();
    }

    public void update(final Long id, final MedicalRecordDTO medicalRecordDTO) {
        final MedicalRecord medicalRecord = medicalRecordRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(medicalRecordDTO, medicalRecord);
        medicalRecordRepository.save(medicalRecord);
    }

    public void delete(final Long id) {
        medicalRecordRepository.deleteById(id);
    }

    private MedicalRecordDTO mapToDTO(final MedicalRecord medicalRecord,
            final MedicalRecordDTO medicalRecordDTO) {
        medicalRecordDTO.setId(medicalRecord.getId());
        medicalRecordDTO.setNotes(medicalRecord.getNotes());
        medicalRecordDTO.setSchedule(medicalRecord.getSchedule() == null ? null : medicalRecord.getSchedule().getId());
        return medicalRecordDTO;
    }

    private MedicalRecord mapToEntity(final MedicalRecordDTO medicalRecordDTO,
            final MedicalRecord medicalRecord) {
        medicalRecord.setNotes(medicalRecordDTO.getNotes());
        final Schedule schedule = medicalRecordDTO.getSchedule() == null ? null : scheduleRepository.findById(medicalRecordDTO.getSchedule())
                .orElseThrow(() -> new NotFoundException("schedule not found"));
        medicalRecord.setSchedule(schedule);
        return medicalRecord;
    }

    public boolean scheduleExists(final Long id) {
        return medicalRecordRepository.existsByScheduleId(id);
    }

}
