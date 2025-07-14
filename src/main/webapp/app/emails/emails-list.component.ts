import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { EmailsService } from 'app/emails/emails.service';
import { EmailsDTO } from 'app/emails/emails.model';


@Component({
  selector: 'app-emails-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './emails-list.component.html'})
export class EmailsListComponent implements OnInit, OnDestroy {

  emailsService = inject(EmailsService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  emailses?: EmailsDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@emails.delete.success:Emails was removed successfully.`    };
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
    this.emailsService.getAllEmailses()
        .subscribe({
          next: (data) => this.emailses = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.emailsService.deleteEmails(id)
        .subscribe({
          next: () => this.router.navigate(['/emailss'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
