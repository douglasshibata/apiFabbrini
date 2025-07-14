import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ScheduleService } from 'app/schedule/schedule.service';
import { ScheduleDTO } from 'app/schedule/schedule.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { validUuid } from 'app/common/utils';


@Component({
  selector: 'app-schedule-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './schedule-add.component.html'
})
export class ScheduleAddComponent implements OnInit {

  scheduleService = inject(ScheduleService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  patientValues?: Map<number,string>;
  doctorsAvailableScheduleValues?: Map<number,string>;

  addForm = new FormGroup({
    appoimentTime: new FormControl(null),
    videoHashLink: new FormControl(null, [validUuid]),
    note: new FormControl(null),
    patient: new FormControl(null),
    doctorsAvailableSchedule: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@schedule.create.success:Schedule was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.scheduleService.getPatientValues()
        .subscribe({
          next: (data) => this.patientValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.scheduleService.getDoctorsAvailableScheduleValues()
        .subscribe({
          next: (data) => this.doctorsAvailableScheduleValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new ScheduleDTO(this.addForm.value);
    this.scheduleService.createSchedule(data)
        .subscribe({
          next: () => this.router.navigate(['/schedules'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
