import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { MedicalRecordService } from 'app/medical-record/medical-record.service';
import { MedicalRecordDTO } from 'app/medical-record/medical-record.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-medical-record-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './medical-record-add.component.html'
})
export class MedicalRecordAddComponent implements OnInit {

  medicalRecordService = inject(MedicalRecordService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  scheduleValues?: Map<number,string>;

  addForm = new FormGroup({
    notes: new FormControl(null),
    schedule: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@medicalRecord.create.success:Medical Record was created successfully.`,
      MEDICAL_RECORD_SCHEDULE_UNIQUE: $localize`:@@Exists.medicalRecord.schedule:This Schedule is already referenced by another Medical Record.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.medicalRecordService.getScheduleValues()
        .subscribe({
          next: (data) => this.scheduleValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new MedicalRecordDTO(this.addForm.value);
    this.medicalRecordService.createMedicalRecord(data)
        .subscribe({
          next: () => this.router.navigate(['/medicalRecords'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
