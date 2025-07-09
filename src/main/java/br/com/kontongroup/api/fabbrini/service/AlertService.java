package br.com.kontongroup.api.fabbrini.service;

import br.com.kontongroup.api.fabbrini.domain.Alert;
import br.com.kontongroup.api.fabbrini.model.AlertDTO;
import br.com.kontongroup.api.fabbrini.repos.AlertRepository;
import br.com.kontongroup.api.fabbrini.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class AlertService {

    private final AlertRepository alertRepository;

    public AlertService(final AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public List<AlertDTO> findAll() {
        final List<Alert> alerts = alertRepository.findAll(Sort.by("id"));
        return alerts.stream()
                .map(alert -> mapToDTO(alert, new AlertDTO()))
                .toList();
    }

    public AlertDTO get(final Long id) {
        return alertRepository.findById(id)
                .map(alert -> mapToDTO(alert, new AlertDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final AlertDTO alertDTO) {
        final Alert alert = new Alert();
        mapToEntity(alertDTO, alert);
        return alertRepository.save(alert).getId();
    }

    public void update(final Long id, final AlertDTO alertDTO) {
        final Alert alert = alertRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(alertDTO, alert);
        alertRepository.save(alert);
    }

    public void delete(final Long id) {
        alertRepository.deleteById(id);
    }

    private AlertDTO mapToDTO(final Alert alert, final AlertDTO alertDTO) {
        alertDTO.setId(alert.getId());
        alertDTO.setDescription(alert.getDescription());
        alertDTO.setExpirationTime(alert.getExpirationTime());
        alertDTO.setActive(alert.getActive());
        alertDTO.setAlertType(alert.getAlertType());
        return alertDTO;
    }

    private Alert mapToEntity(final AlertDTO alertDTO, final Alert alert) {
        alert.setDescription(alertDTO.getDescription());
        alert.setExpirationTime(alertDTO.getExpirationTime());
        alert.setActive(alertDTO.getActive());
        alert.setAlertType(alertDTO.getAlertType());
        return alert;
    }

}
