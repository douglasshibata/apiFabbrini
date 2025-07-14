import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ScheduleService } from 'app/schedule/schedule.service';
import { ScheduleDTO } from 'app/schedule/schedule.model';


@Component({
  selector: 'app-schedule-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './schedule-list.component.html'})
export class ScheduleListComponent implements OnInit, OnDestroy {

  scheduleService = inject(ScheduleService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  schedules?: ScheduleDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@schedule.delete.success:Schedule was removed successfully.`,
      'schedule.medicalRecord.schedule.referenced': $localize`:@@schedule.medicalRecord.schedule.referenced:This entity is still referenced by Medical Record ${details?.id} via field Schedule.`
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
    this.scheduleService.getAllSchedules()
        .subscribe({
          next: (data) => this.schedules = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.scheduleService.deleteSchedule(id)
        .subscribe({
          next: () => this.router.navigate(['/schedules'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/schedules'], {
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
