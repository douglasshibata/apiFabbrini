import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ScheduleService } from 'app/schedule/schedule.service';
import { ScheduleDTO } from 'app/schedule/schedule.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm, validUuid } from 'app/common/utils';


@Component({
  selector: 'app-schedule-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './schedule-edit.component.html'
})
export class ScheduleEditComponent implements OnInit {

  scheduleService = inject(ScheduleService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  patientValues?: Map<number,string>;
  doctorsAvailableScheduleValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    appoimentTime: new FormControl(null),
    videoHashLink: new FormControl(null, [validUuid]),
    note: new FormControl(null),
    patient: new FormControl(null),
    doctorsAvailableSchedule: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@schedule.update.success:Schedule was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
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
    this.scheduleService.getSchedule(this.currentId!)
        .subscribe({
          next: (data) => updateForm(this.editForm, data),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.editForm.markAllAsTouched();
    if (!this.editForm.valid) {
      return;
    }
    const data = new ScheduleDTO(this.editForm.value);
    this.scheduleService.updateSchedule(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/schedules'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
