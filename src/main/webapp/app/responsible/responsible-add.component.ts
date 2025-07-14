import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ResponsibleService } from 'app/responsible/responsible.service';
import { ResponsibleDTO } from 'app/responsible/responsible.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-responsible-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './responsible-add.component.html'
})
export class ResponsibleAddComponent implements OnInit {

  responsibleService = inject(ResponsibleService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  phonesValues?: Map<number,string>;
  patientValues?: Map<number,string>;

  addForm = new FormGroup({
    name: new FormControl(null, [Validators.maxLength(255)]),
    degreeOfRelatedness: new FormControl(null, [Validators.maxLength(255)]),
    phones: new FormControl(null, [Validators.required]),
    patient: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@responsible.create.success:Responsible was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.responsibleService.getPhonesValues()
        .subscribe({
          next: (data) => this.phonesValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.responsibleService.getPatientValues()
        .subscribe({
          next: (data) => this.patientValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new ResponsibleDTO(this.addForm.value);
    this.responsibleService.createResponsible(data)
        .subscribe({
          next: () => this.router.navigate(['/responsibles'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
