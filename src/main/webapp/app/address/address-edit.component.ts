import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AddressService } from 'app/address/address.service';
import { AddressDTO } from 'app/address/address.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-address-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './address-edit.component.html'
})
export class AddressEditComponent implements OnInit {

  addressService = inject(AddressService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  userValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    address: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    cep: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
    complement: new FormControl(null, [Validators.maxLength(255)]),
    neighbourhood: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    number: new FormControl(null),
    city: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    uf: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    user: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@address.update.success:Address was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.addressService.getUserValues()
        .subscribe({
          next: (data) => this.userValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.addressService.getAddress(this.currentId!)
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
    const data = new AddressDTO(this.editForm.value);
    this.addressService.updateAddress(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/addresses'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
