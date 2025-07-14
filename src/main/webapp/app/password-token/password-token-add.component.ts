import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { PasswordTokenService } from 'app/password-token/password-token.service';
import { PasswordTokenDTO } from 'app/password-token/password-token.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { validUuid } from 'app/common/utils';


@Component({
  selector: 'app-password-token-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './password-token-add.component.html'
})
export class PasswordTokenAddComponent {

  passwordTokenService = inject(PasswordTokenService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    token: new FormControl(null, [validUuid]),
    expirationTime: new FormControl(null),
    typeToken: new FormControl(null, [Validators.maxLength(255)]),
    used: new FormControl(false)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@passwordToken.create.success:Password Token was created successfully.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new PasswordTokenDTO(this.addForm.value);
    this.passwordTokenService.createPasswordToken(data)
        .subscribe({
          next: () => this.router.navigate(['/passwordTokens'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
