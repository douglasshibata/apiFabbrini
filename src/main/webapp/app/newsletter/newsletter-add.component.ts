import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { NewsletterService } from 'app/newsletter/newsletter.service';
import { NewsletterDTO } from 'app/newsletter/newsletter.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-newsletter-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './newsletter-add.component.html'
})
export class NewsletterAddComponent {

  newsletterService = inject(NewsletterService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    title: new FormControl(null, [Validators.maxLength(255)]),
    content: new FormControl(null),
    file: new FormControl(null),
    deliveryDate: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@newsletter.create.success:Newsletter was created successfully.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new NewsletterDTO(this.addForm.value);
    this.newsletterService.createNewsletter(data)
        .subscribe({
          next: () => this.router.navigate(['/newsletters'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
