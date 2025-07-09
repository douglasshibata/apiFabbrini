package br.com.kontongroup.api.fabbrini.service;

import br.com.kontongroup.api.fabbrini.domain.DoctorsAvailableSchedule;
import br.com.kontongroup.api.fabbrini.domain.MedicalRecord;
import br.com.kontongroup.api.fabbrini.domain.Patient;
import br.com.kontongroup.api.fabbrini.domain.Schedule;
import br.com.kontongroup.api.fabbrini.model.ScheduleDTO;
import br.com.kontongroup.api.fabbrini.repos.DoctorsAvailableScheduleRepository;
import br.com.kontongroup.api.fabbrini.repos.MedicalRecordRepository;
import br.com.kontongroup.api.fabbrini.repos.PatientRepository;
import br.com.kontongroup.api.fabbrini.repos.ScheduleRepository;
import br.com.kontongroup.api.fabbrini.util.NotFoundException;
import br.com.kontongroup.api.fabbrini.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final PatientRepository patientRepository;
    private final DoctorsAvailableScheduleRepository doctorsAvailableScheduleRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    public ScheduleService(final ScheduleRepository scheduleRepository,
            final PatientRepository patientRepository,
            final DoctorsAvailableScheduleRepository doctorsAvailableScheduleRepository,
            final MedicalRecordRepository medicalRecordRepository) {
        this.scheduleRepository = scheduleRepository;
        this.patientRepository = patientRepository;
        this.doctorsAvailableScheduleRepository = doctorsAvailableScheduleRepository;
        this.medicalRecordRepository = medicalRecordRepository;
    }

    public List<ScheduleDTO> findAll() {
        final List<Schedule> schedules = scheduleRepository.findAll(Sort.by("id"));
        return schedules.stream()
                .map(schedule -> mapToDTO(schedule, new ScheduleDTO()))
                .toList();
    }

    public ScheduleDTO get(final Long id) {
        return scheduleRepository.findById(id)
                .map(schedule -> mapToDTO(schedule, new ScheduleDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final ScheduleDTO scheduleDTO) {
        final Schedule schedule = new Schedule();
        mapToEntity(scheduleDTO, schedule);
        return scheduleRepository.save(schedule).getId();
    }

    public void update(final Long id, final ScheduleDTO scheduleDTO) {
        final Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(scheduleDTO, schedule);
        scheduleRepository.save(schedule);
    }

    public void delete(final Long id) {
        scheduleRepository.deleteById(id);
    }

    private ScheduleDTO mapToDTO(final Schedule schedule, final ScheduleDTO scheduleDTO) {
        scheduleDTO.setId(schedule.getId());
        scheduleDTO.setAppoimentTime(schedule.getAppoimentTime());
        scheduleDTO.setVideoHashLink(schedule.getVideoHashLink());
        scheduleDTO.setNote(schedule.getNote());
        scheduleDTO.setPatient(schedule.getPatient() == null ? null : schedule.getPatient().getId());
        scheduleDTO.setDoctorsAvailableSchedule(schedule.getDoctorsAvailableSchedule() == null ? null : schedule.getDoctorsAvailableSchedule().getId());
        return scheduleDTO;
    }

    private Schedule mapToEntity(final ScheduleDTO scheduleDTO, final Schedule schedule) {
        schedule.setAppoimentTime(scheduleDTO.getAppoimentTime());
        schedule.setVideoHashLink(scheduleDTO.getVideoHashLink());
        schedule.setNote(scheduleDTO.getNote());
        final Patient patient = scheduleDTO.getPatient() == null ? null : patientRepository.findById(scheduleDTO.getPatient())
                .orElseThrow(() -> new NotFoundException("patient not found"));
        schedule.setPatient(patient);
        final DoctorsAvailableSchedule doctorsAvailableSchedule = scheduleDTO.getDoctorsAvailableSchedule() == null ? null : doctorsAvailableScheduleRepository.findById(scheduleDTO.getDoctorsAvailableSchedule())
                .orElseThrow(() -> new NotFoundException("doctorsAvailableSchedule not found"));
        schedule.setDoctorsAvailableSchedule(doctorsAvailableSchedule);
        return schedule;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final MedicalRecord scheduleMedicalRecord = medicalRecordRepository.findFirstBySchedule(schedule);
        if (scheduleMedicalRecord != null) {
            referencedWarning.setKey("schedule.medicalRecord.schedule.referenced");
            referencedWarning.addParam(scheduleMedicalRecord.getId());
            return referencedWarning;
        }
        return null;
    }

}
