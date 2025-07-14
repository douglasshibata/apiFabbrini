import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { MedicalRecordService } from 'app/medical-record/medical-record.service';
import { MedicalRecordDTO } from 'app/medical-record/medical-record.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-medical-record-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './medical-record-edit.component.html'
})
export class MedicalRecordEditComponent implements OnInit {

  medicalRecordService = inject(MedicalRecordService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  scheduleValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    notes: new FormControl(null),
    schedule: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@medicalRecord.update.success:Medical Record was updated successfully.`,
      MEDICAL_RECORD_SCHEDULE_UNIQUE: $localize`:@@Exists.medicalRecord.schedule:This Schedule is already referenced by another Medical Record.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.medicalRecordService.getScheduleValues()
        .subscribe({
          next: (data) => this.scheduleValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.medicalRecordService.getMedicalRecord(this.currentId!)
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
    const data = new MedicalRecordDTO(this.editForm.value);
    this.medicalRecordService.updateMedicalRecord(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/medicalRecords'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
