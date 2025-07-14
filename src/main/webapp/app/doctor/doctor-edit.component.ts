import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DoctorService } from 'app/doctor/doctor.service';
import { DoctorDTO } from 'app/doctor/doctor.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-doctor-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './doctor-edit.component.html'
})
export class DoctorEditComponent implements OnInit {

  doctorService = inject(DoctorService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  userValues?: Map<number,string>;
  specialtyValues?: Map<number,string>;
  healthinsurancesValues?: Map<number,string>;
  documentsValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
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
      updated: $localize`:@@doctor.update.success:Doctor was updated successfully.`,
      DOCTOR_USER_UNIQUE: $localize`:@@Exists.doctor.user:This User is already referenced by another Doctor.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
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
    this.doctorService.getDoctor(this.currentId!)
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
    const data = new DoctorDTO(this.editForm.value);
    this.doctorService.updateDoctor(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/doctors'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
