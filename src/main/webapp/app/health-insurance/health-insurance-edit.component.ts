import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { HealthInsuranceService } from 'app/health-insurance/health-insurance.service';
import { HealthInsuranceDTO } from 'app/health-insurance/health-insurance.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-health-insurance-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './health-insurance-edit.component.html'
})
export class HealthInsuranceEditComponent implements OnInit {

  healthInsuranceService = inject(HealthInsuranceService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  documentsValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    number: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    type: new FormControl(null, [Validators.maxLength(255)]),
    plan: new FormControl(null, [Validators.maxLength(255)]),
    carrier: new FormControl(null, [Validators.maxLength(255)]),
    active: new FormControl(false),
    documents: new FormControl([])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@healthInsurance.update.success:Health Insurance was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.healthInsuranceService.getDocumentsValues()
        .subscribe({
          next: (data) => this.documentsValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.healthInsuranceService.getHealthInsurance(this.currentId!)
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
    const data = new HealthInsuranceDTO(this.editForm.value);
    this.healthInsuranceService.updateHealthInsurance(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/healthInsurances'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
