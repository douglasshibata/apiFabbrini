import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { PhonesService } from 'app/phones/phones.service';
import { PhonesDTO } from 'app/phones/phones.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-phones-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './phones-add.component.html'
})
export class PhonesAddComponent implements OnInit {

  phonesService = inject(PhonesService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  userValues?: Map<number,string>;

  addForm = new FormGroup({
    ddd: new FormControl(null, [Validators.maxLength(4)]),
    number: new FormControl(null, [Validators.maxLength(40)]),
    user: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@phones.create.success:Phones was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.phonesService.getUserValues()
        .subscribe({
          next: (data) => this.userValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new PhonesDTO(this.addForm.value);
    this.phonesService.createPhones(data)
        .subscribe({
          next: () => this.router.navigate(['/phoness'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
