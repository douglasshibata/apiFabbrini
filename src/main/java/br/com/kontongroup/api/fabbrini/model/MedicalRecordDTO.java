package br.com.kontongroup.api.fabbrini.model;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class MedicalRecordDTO {

    private Long id;

    private String notes;

    @MedicalRecordScheduleUnique
    private Long schedule;

}
