import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { PasswordTokenService } from 'app/password-token/password-token.service';
import { PasswordTokenDTO } from 'app/password-token/password-token.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm, validUuid } from 'app/common/utils';


@Component({
  selector: 'app-password-token-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './password-token-edit.component.html'
})
export class PasswordTokenEditComponent implements OnInit {

  passwordTokenService = inject(PasswordTokenService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    token: new FormControl(null, [validUuid]),
    expirationTime: new FormControl(null),
    typeToken: new FormControl(null, [Validators.maxLength(255)]),
    used: new FormControl(false)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@passwordToken.update.success:Password Token was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.passwordTokenService.getPasswordToken(this.currentId!)
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
    const data = new PasswordTokenDTO(this.editForm.value);
    this.passwordTokenService.updatePasswordToken(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/passwordTokens'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
