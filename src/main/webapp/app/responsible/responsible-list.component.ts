import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ResponsibleService } from 'app/responsible/responsible.service';
import { ResponsibleDTO } from 'app/responsible/responsible.model';


@Component({
  selector: 'app-responsible-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './responsible-list.component.html'})
export class ResponsibleListComponent implements OnInit, OnDestroy {

  responsibleService = inject(ResponsibleService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  responsibles?: ResponsibleDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@responsible.delete.success:Responsible was removed successfully.`    };
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
    this.responsibleService.getAllResponsibles()
        .subscribe({
          next: (data) => this.responsibles = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.responsibleService.deleteResponsible(id)
        .subscribe({
          next: () => this.router.navigate(['/responsibles'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
