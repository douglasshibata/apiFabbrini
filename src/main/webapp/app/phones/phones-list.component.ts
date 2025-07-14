import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { PhonesService } from 'app/phones/phones.service';
import { PhonesDTO } from 'app/phones/phones.model';


@Component({
  selector: 'app-phones-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './phones-list.component.html'})
export class PhonesListComponent implements OnInit, OnDestroy {

  phonesService = inject(PhonesService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  phoneses?: PhonesDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@phones.delete.success:Phones was removed successfully.`,
      'phones.responsible.phones.referenced': $localize`:@@phones.responsible.phones.referenced:This entity is still referenced by Responsible ${details?.id} via field Phones.`
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
    this.phonesService.getAllPhoneses()
        .subscribe({
          next: (data) => this.phoneses = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.phonesService.deletePhones(id)
        .subscribe({
          next: () => this.router.navigate(['/phoness'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/phoness'], {
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
