package br.com.kontongroup.api.fabbrini.model;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ScheduleDTO {

    private Long id;
    private LocalDateTime appoimentTime;
    private UUID videoHashLink;
    private String note;
    private Long patient;
    private Long doctorsAvailableSchedule;

}
