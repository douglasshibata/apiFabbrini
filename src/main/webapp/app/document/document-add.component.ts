import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DocumentService } from 'app/document/document.service';
import { DocumentDTO } from 'app/document/document.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-document-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './document-add.component.html'
})
export class DocumentAddComponent {

  documentService = inject(DocumentService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    documentType: new FormControl(null, [Validators.required]),
    file: new FormControl(null, [Validators.required]),
    filename: new FormControl(null, [Validators.maxLength(255)]),
    fileType: new FormControl(null, [Validators.maxLength(255)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@document.create.success:Document was created successfully.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new DocumentDTO(this.addForm.value);
    this.documentService.createDocument(data)
        .subscribe({
          next: () => this.router.navigate(['/documents'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
