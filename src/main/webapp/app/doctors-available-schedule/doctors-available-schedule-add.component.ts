import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DoctorsAvailableScheduleService } from 'app/doctors-available-schedule/doctors-available-schedule.service';
import { DoctorsAvailableScheduleDTO } from 'app/doctors-available-schedule/doctors-available-schedule.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-doctors-available-schedule-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './doctors-available-schedule-add.component.html'
})
export class DoctorsAvailableScheduleAddComponent implements OnInit {

  doctorsAvailableScheduleService = inject(DoctorsAvailableScheduleService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  doctorValues?: Map<number,string>;

  addForm = new FormGroup({
    dayOfWeek: new FormControl(null, [Validators.maxLength(255)]),
    startDateTime: new FormControl(null),
    endDateTime: new FormControl(null),
    interval: new FormControl(null),
    active: new FormControl(false),
    doctor: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@doctorsAvailableSchedule.create.success:Doctors Available Schedule was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.doctorsAvailableScheduleService.getDoctorValues()
        .subscribe({
          next: (data) => this.doctorValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new DoctorsAvailableScheduleDTO(this.addForm.value);
    this.doctorsAvailableScheduleService.createDoctorsAvailableSchedule(data)
        .subscribe({
          next: () => this.router.navigate(['/doctorsAvailableSchedules'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
