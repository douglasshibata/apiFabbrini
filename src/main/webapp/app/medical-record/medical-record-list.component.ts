import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { MedicalRecordService } from 'app/medical-record/medical-record.service';
import { MedicalRecordDTO } from 'app/medical-record/medical-record.model';


@Component({
  selector: 'app-medical-record-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './medical-record-list.component.html'})
export class MedicalRecordListComponent implements OnInit, OnDestroy {

  medicalRecordService = inject(MedicalRecordService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  medicalRecords?: MedicalRecordDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@medicalRecord.delete.success:Medical Record was removed successfully.`    };
    return messages[key];
  }

  ngOnInit() {
    this.loadData();
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    this.navigationSubscription!.unsubscribe();
  }
  
  loadData() {
    this.medicalRecordService.getAllMedicalRecords()
        .subscribe({
          next: (data) => this.medicalRecords = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.medicalRecordService.deleteMedicalRecord(id)
        .subscribe({
          next: () => this.router.navigate(['/medicalRecords'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
