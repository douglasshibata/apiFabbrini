import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DoctorService } from 'app/doctor/doctor.service';
import { DoctorDTO } from 'app/doctor/doctor.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-doctor-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './doctor-add.component.html'
})
export class DoctorAddComponent implements OnInit {

  doctorService = inject(DoctorService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  userValues?: Map<number,string>;
  specialtyValues?: Map<number,string>;
  healthinsurancesValues?: Map<number,string>;
  documentsValues?: Map<number,string>;

  addForm = new FormGroup({
    conselho: new FormControl(null, [Validators.maxLength(255)]),
    ufconselho: new FormControl(null, [Validators.maxLength(255)]),
    registro: new FormControl(null, [Validators.maxLength(255)]),
    title: new FormControl(null, [Validators.maxLength(255)]),
    user: new FormControl(null),
    specialty: new FormControl(null),
    healthinsurances: new FormControl([]),
    documents: new FormControl([])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@doctor.create.success:Doctor was created successfully.`,
      DOCTOR_USER_UNIQUE: $localize`:@@Exists.doctor.user:This User is already referenced by another Doctor.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.doctorService.getUserValues()
        .subscribe({
          next: (data) => this.userValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.doctorService.getSpecialtyValues()
        .subscribe({
          next: (data) => this.specialtyValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.doctorService.getHealthinsurancesValues()
        .subscribe({
          next: (data) => this.healthinsurancesValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.doctorService.getDocumentsValues()
        .subscribe({
          next: (data) => this.documentsValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new DoctorDTO(this.addForm.value);
    this.doctorService.createDoctor(data)
        .subscribe({
          next: () => this.router.navigate(['/doctors'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
