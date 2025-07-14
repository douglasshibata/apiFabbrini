import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { PatientService } from 'app/patient/patient.service';
import { PatientDTO } from 'app/patient/patient.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-patient-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './patient-add.component.html'
})
export class PatientAddComponent implements OnInit {

  patientService = inject(PatientService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  userValues?: Map<number,string>;
  documentsValues?: Map<number,string>;
  healthInsurancesValues?: Map<number,string>;

  addForm = new FormGroup({
    fullname: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    cpf: new FormControl(null, [Validators.maxLength(255)]),
    rg: new FormControl(null, [Validators.maxLength(255)]),
    socialname: new FormControl(null, [Validators.maxLength(255)]),
    user: new FormControl(null, [Validators.required]),
    documents: new FormControl([]),
    healthInsurances: new FormControl([])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@patient.create.success:Patient was created successfully.`,
      PATIENT_CPF_UNIQUE: $localize`:@@Exists.patient.cpf:This Cpf is already taken.`,
      PATIENT_USER_UNIQUE: $localize`:@@Exists.patient.user:This User is already referenced by another Patient.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.patientService.getUserValues()
        .subscribe({
          next: (data) => this.userValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.patientService.getDocumentsValues()
        .subscribe({
          next: (data) => this.documentsValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.patientService.getHealthInsurancesValues()
        .subscribe({
          next: (data) => this.healthInsurancesValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new PatientDTO(this.addForm.value);
    this.patientService.createPatient(data)
        .subscribe({
          next: () => this.router.navigate(['/patients'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
