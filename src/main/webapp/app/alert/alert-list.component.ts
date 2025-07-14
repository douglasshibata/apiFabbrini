import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AlertService } from 'app/alert/alert.service';
import { AlertDTO } from 'app/alert/alert.model';


@Component({
  selector: 'app-alert-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './alert-list.component.html'})
export class AlertListComponent implements OnInit, OnDestroy {

  alertService = inject(AlertService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  alerts?: AlertDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@alert.delete.success:Alert was removed successfully.`    };
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
    this.alertService.getAllAlerts()
        .subscribe({
          next: (data) => this.alerts = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.alertService.deleteAlert(id)
        .subscribe({
          next: () => this.router.navigate(['/alerts'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
