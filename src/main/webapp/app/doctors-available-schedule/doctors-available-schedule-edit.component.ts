import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DoctorsAvailableScheduleService } from 'app/doctors-available-schedule/doctors-available-schedule.service';
import { DoctorsAvailableScheduleDTO } from 'app/doctors-available-schedule/doctors-available-schedule.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-doctors-available-schedule-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './doctors-available-schedule-edit.component.html'
})
export class DoctorsAvailableScheduleEditComponent implements OnInit {

  doctorsAvailableScheduleService = inject(DoctorsAvailableScheduleService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  doctorValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    dayOfWeek: new FormControl(null, [Validators.maxLength(255)]),
    startDateTime: new FormControl(null),
    endDateTime: new FormControl(null),
    interval: new FormControl(null),
    active: new FormControl(false),
    doctor: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@doctorsAvailableSchedule.update.success:Doctors Available Schedule was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.doctorsAvailableScheduleService.getDoctorValues()
        .subscribe({
          next: (data) => this.doctorValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.doctorsAvailableScheduleService.getDoctorsAvailableSchedule(this.currentId!)
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
    const data = new DoctorsAvailableScheduleDTO(this.editForm.value);
    this.doctorsAvailableScheduleService.updateDoctorsAvailableSchedule(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/doctorsAvailableSchedules'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
