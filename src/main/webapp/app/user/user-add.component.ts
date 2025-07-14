import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { UserService } from 'app/user/user.service';
import { UserDTO } from 'app/user/user.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-user-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './user-add.component.html'
})
export class UserAddComponent implements OnInit {

  userService = inject(UserService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  roleValues?: Map<number,string>;

  addForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    password: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    fullname: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    active: new FormControl(false),
    socialname: new FormControl(null, [Validators.maxLength(255)]),
    cpf: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    crm: new FormControl(null, [Validators.maxLength(255)]),
    countAccess: new FormControl(null),
    role: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@user.create.success:User was created successfully.`,
      USER_EMAIL_UNIQUE: $localize`:@@Exists.user.email:This Email is already taken.`,
      USER_CPF_UNIQUE: $localize`:@@Exists.user.cpf:This Cpf is already taken.`,
      USER_ROLE_UNIQUE: $localize`:@@Exists.user.role:This Role is already referenced by another User.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.userService.getRoleValues()
        .subscribe({
          next: (data) => this.roleValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new UserDTO(this.addForm.value);
    this.userService.createUser(data)
        .subscribe({
          next: () => this.router.navigate(['/users'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
