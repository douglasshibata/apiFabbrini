import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { DoctorService } from 'app/doctor/doctor.service';
import { DoctorDTO } from 'app/doctor/doctor.model';


@Component({
  selector: 'app-doctor-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-list.component.html'})
export class DoctorListComponent implements OnInit, OnDestroy {

  doctorService = inject(DoctorService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  doctors?: DoctorDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@doctor.delete.success:Doctor was removed successfully.`,
      'doctor.doctorsAvailableSchedule.doctor.referenced': $localize`:@@doctor.doctorsAvailableSchedule.doctor.referenced:This entity is still referenced by Doctors Available Schedule ${details?.id} via field Doctor.`
    };
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
    this.doctorService.getAllDoctors()
        .subscribe({
          next: (data) => this.doctors = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.doctorService.deleteDoctor(id)
        .subscribe({
          next: () => this.router.navigate(['/doctors'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/doctors'], {
                state: {
                  msgError: this.getMessage(messageParts[0], { id: messageParts[1] })
                }
              });
              return;
            }
            this.errorHandler.handleServerError(error.error)
          }
        });
  }

}
