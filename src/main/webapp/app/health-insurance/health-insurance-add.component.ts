import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { HealthInsuranceService } from 'app/health-insurance/health-insurance.service';
import { HealthInsuranceDTO } from 'app/health-insurance/health-insurance.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-health-insurance-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './health-insurance-add.component.html'
})
export class HealthInsuranceAddComponent implements OnInit {

  healthInsuranceService = inject(HealthInsuranceService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  documentsValues?: Map<number,string>;

  addForm = new FormGroup({
    number: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    type: new FormControl(null, [Validators.maxLength(255)]),
    plan: new FormControl(null, [Validators.maxLength(255)]),
    carrier: new FormControl(null, [Validators.maxLength(255)]),
    active: new FormControl(false),
    documents: new FormControl([])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@healthInsurance.create.success:Health Insurance was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.healthInsuranceService.getDocumentsValues()
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
    const data = new HealthInsuranceDTO(this.addForm.value);
    this.healthInsuranceService.createHealthInsurance(data)
        .subscribe({
          next: () => this.router.navigate(['/healthInsurances'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
