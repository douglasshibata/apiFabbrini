import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { EmailsService } from 'app/emails/emails.service';
import { EmailsDTO } from 'app/emails/emails.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-emails-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './emails-add.component.html'
})
export class EmailsAddComponent implements OnInit {

  emailsService = inject(EmailsService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  newsletterValues?: Map<number,string>;

  addForm = new FormGroup({
    email: new FormControl(null, [Validators.maxLength(255)]),
    active: new FormControl(false),
    newsletter: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@emails.create.success:Emails was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.emailsService.getNewsletterValues()
        .subscribe({
          next: (data) => this.newsletterValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new EmailsDTO(this.addForm.value);
    this.emailsService.createEmails(data)
        .subscribe({
          next: () => this.router.navigate(['/emailss'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
