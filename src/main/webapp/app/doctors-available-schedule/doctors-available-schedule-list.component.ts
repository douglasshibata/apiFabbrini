import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { DoctorsAvailableScheduleService } from 'app/doctors-available-schedule/doctors-available-schedule.service';
import { DoctorsAvailableScheduleDTO } from 'app/doctors-available-schedule/doctors-available-schedule.model';


@Component({
  selector: 'app-doctors-available-schedule-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './doctors-available-schedule-list.component.html'})
export class DoctorsAvailableScheduleListComponent implements OnInit, OnDestroy {

  doctorsAvailableScheduleService = inject(DoctorsAvailableScheduleService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  doctorsAvailableSchedules?: DoctorsAvailableScheduleDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@doctorsAvailableSchedule.delete.success:Doctors Available Schedule was removed successfully.`,
      'doctorsAvailableSchedule.schedule.doctorsAvailableSchedule.referenced': $localize`:@@doctorsAvailableSchedule.schedule.doctorsAvailableSchedule.referenced:This entity is still referenced by Schedule ${details?.id} via field Doctors Available Schedule.`
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
    this.doctorsAvailableScheduleService.getAllDoctorsAvailableSchedules()
        .subscribe({
          next: (data) => this.doctorsAvailableSchedules = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.doctorsAvailableScheduleService.deleteDoctorsAvailableSchedule(id)
        .subscribe({
          next: () => this.router.navigate(['/doctorsAvailableSchedules'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/doctorsAvailableSchedules'], {
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
