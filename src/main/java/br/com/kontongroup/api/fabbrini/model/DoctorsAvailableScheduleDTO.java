package br.com.kontongroup.api.fabbrini.model;

import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class DoctorsAvailableScheduleDTO {

    private Long id;

    @Size(max = 255)
    private String dayOfWeek;

    private LocalDateTime startDateTime;

    private LocalDateTime endDateTime;

    private LocalDateTime interval;

    private Boolean active;

    private Long doctor;

}
