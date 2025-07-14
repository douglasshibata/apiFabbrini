import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { SpecialtyService } from 'app/specialty/specialty.service';
import { SpecialtyDTO } from 'app/specialty/specialty.model';


@Component({
  selector: 'app-specialty-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './specialty-list.component.html'})
export class SpecialtyListComponent implements OnInit, OnDestroy {

  specialtyService = inject(SpecialtyService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  specialties?: SpecialtyDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@specialty.delete.success:Specialty was removed successfully.`,
      'specialty.doctor.specialty.referenced': $localize`:@@specialty.doctor.specialty.referenced:This entity is still referenced by Doctor ${details?.id} via field Specialty.`
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
    this.specialtyService.getAllSpecialties()
        .subscribe({
          next: (data) => this.specialties = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.specialtyService.deleteSpecialty(id)
        .subscribe({
          next: () => this.router.navigate(['/specialties'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/specialties'], {
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
