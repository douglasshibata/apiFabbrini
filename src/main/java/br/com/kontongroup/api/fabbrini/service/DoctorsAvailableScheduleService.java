package br.com.kontongroup.api.fabbrini.service;

import br.com.kontongroup.api.fabbrini.domain.Doctor;
import br.com.kontongroup.api.fabbrini.domain.DoctorsAvailableSchedule;
import br.com.kontongroup.api.fabbrini.domain.Schedule;
import br.com.kontongroup.api.fabbrini.model.DoctorsAvailableScheduleDTO;
import br.com.kontongroup.api.fabbrini.repos.DoctorRepository;
import br.com.kontongroup.api.fabbrini.repos.DoctorsAvailableScheduleRepository;
import br.com.kontongroup.api.fabbrini.repos.ScheduleRepository;
import br.com.kontongroup.api.fabbrini.util.NotFoundException;
import br.com.kontongroup.api.fabbrini.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class DoctorsAvailableScheduleService {

    private final DoctorsAvailableScheduleRepository doctorsAvailableScheduleRepository;
    private final DoctorRepository doctorRepository;
    private final ScheduleRepository scheduleRepository;

    public DoctorsAvailableScheduleService(
            final DoctorsAvailableScheduleRepository doctorsAvailableScheduleRepository,
            final DoctorRepository doctorRepository, final ScheduleRepository scheduleRepository) {
        this.doctorsAvailableScheduleRepository = doctorsAvailableScheduleRepository;
        this.doctorRepository = doctorRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public List<DoctorsAvailableScheduleDTO> findAll() {
        final List<DoctorsAvailableSchedule> doctorsAvailableSchedules = doctorsAvailableScheduleRepository.findAll(Sort.by("id"));
        return doctorsAvailableSchedules.stream()
                .map(doctorsAvailableSchedule -> mapToDTO(doctorsAvailableSchedule, new DoctorsAvailableScheduleDTO()))
                .toList();
    }

    public DoctorsAvailableScheduleDTO get(final Long id) {
        return doctorsAvailableScheduleRepository.findById(id)
                .map(doctorsAvailableSchedule -> mapToDTO(doctorsAvailableSchedule, new DoctorsAvailableScheduleDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final DoctorsAvailableScheduleDTO doctorsAvailableScheduleDTO) {
        final DoctorsAvailableSchedule doctorsAvailableSchedule = new DoctorsAvailableSchedule();
        mapToEntity(doctorsAvailableScheduleDTO, doctorsAvailableSchedule);
        return doctorsAvailableScheduleRepository.save(doctorsAvailableSchedule).getId();
    }

    public void update(final Long id,
            final DoctorsAvailableScheduleDTO doctorsAvailableScheduleDTO) {
        final DoctorsAvailableSchedule doctorsAvailableSchedule = doctorsAvailableScheduleRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(doctorsAvailableScheduleDTO, doctorsAvailableSchedule);
        doctorsAvailableScheduleRepository.save(doctorsAvailableSchedule);
    }

    public void delete(final Long id) {
        doctorsAvailableScheduleRepository.deleteById(id);
    }

    private DoctorsAvailableScheduleDTO mapToDTO(
            final DoctorsAvailableSchedule doctorsAvailableSchedule,
            final DoctorsAvailableScheduleDTO doctorsAvailableScheduleDTO) {
        doctorsAvailableScheduleDTO.setId(doctorsAvailableSchedule.getId());
        doctorsAvailableScheduleDTO.setDayOfWeek(doctorsAvailableSchedule.getDayOfWeek());
        doctorsAvailableScheduleDTO.setStartDateTime(doctorsAvailableSchedule.getStartDateTime());
        doctorsAvailableScheduleDTO.setEndDateTime(doctorsAvailableSchedule.getEndDateTime());
        doctorsAvailableScheduleDTO.setInterval(doctorsAvailableSchedule.getInterval());
        doctorsAvailableScheduleDTO.setActive(doctorsAvailableSchedule.getActive());
        doctorsAvailableScheduleDTO.setDoctor(doctorsAvailableSchedule.getDoctor() == null ? null : doctorsAvailableSchedule.getDoctor().getId());
        return doctorsAvailableScheduleDTO;
    }

    private DoctorsAvailableSchedule mapToEntity(
            final DoctorsAvailableScheduleDTO doctorsAvailableScheduleDTO,
            final DoctorsAvailableSchedule doctorsAvailableSchedule) {
        doctorsAvailableSchedule.setDayOfWeek(doctorsAvailableScheduleDTO.getDayOfWeek());
        doctorsAvailableSchedule.setStartDateTime(doctorsAvailableScheduleDTO.getStartDateTime());
        doctorsAvailableSchedule.setEndDateTime(doctorsAvailableScheduleDTO.getEndDateTime());
        doctorsAvailableSchedule.setInterval(doctorsAvailableScheduleDTO.getInterval());
        doctorsAvailableSchedule.setActive(doctorsAvailableScheduleDTO.getActive());
        final Doctor doctor = doctorsAvailableScheduleDTO.getDoctor() == null ? null : doctorRepository.findById(doctorsAvailableScheduleDTO.getDoctor())
                .orElseThrow(() -> new NotFoundException("doctor not found"));
        doctorsAvailableSchedule.setDoctor(doctor);
        return doctorsAvailableSchedule;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final DoctorsAvailableSchedule doctorsAvailableSchedule = doctorsAvailableScheduleRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Schedule doctorsAvailableScheduleSchedule = scheduleRepository.findFirstByDoctorsAvailableSchedule(doctorsAvailableSchedule);
        if (doctorsAvailableScheduleSchedule != null) {
            referencedWarning.setKey("doctorsAvailableSchedule.schedule.doctorsAvailableSchedule.referenced");
            referencedWarning.addParam(doctorsAvailableScheduleSchedule.getId());
            return referencedWarning;
        }
        return null;
    }

}
