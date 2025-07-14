import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { HealthInsuranceService } from 'app/health-insurance/health-insurance.service';
import { HealthInsuranceDTO } from 'app/health-insurance/health-insurance.model';


@Component({
  selector: 'app-health-insurance-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './health-insurance-list.component.html'})
export class HealthInsuranceListComponent implements OnInit, OnDestroy {

  healthInsuranceService = inject(HealthInsuranceService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  healthInsurances?: HealthInsuranceDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@healthInsurance.delete.success:Health Insurance was removed successfully.`    };
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
    this.healthInsuranceService.getAllHealthInsurances()
        .subscribe({
          next: (data) => this.healthInsurances = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.healthInsuranceService.deleteHealthInsurance(id)
        .subscribe({
          next: () => this.router.navigate(['/healthInsurances'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
