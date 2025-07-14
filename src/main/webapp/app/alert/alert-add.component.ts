import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AlertService } from 'app/alert/alert.service';
import { AlertDTO } from 'app/alert/alert.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-alert-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './alert-add.component.html'
})
export class AlertAddComponent {

  alertService = inject(AlertService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    description: new FormControl(null, [Validators.required]),
    expirationTime: new FormControl(null, [Validators.required]),
    active: new FormControl(false),
    alertType: new FormControl(null, [Validators.maxLength(255)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@alert.create.success:Alert was created successfully.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new AlertDTO(this.addForm.value);
    this.alertService.createAlert(data)
        .subscribe({
          next: () => this.router.navigate(['/alerts'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
