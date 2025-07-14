import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { NewsletterService } from 'app/newsletter/newsletter.service';
import { NewsletterDTO } from 'app/newsletter/newsletter.model';


@Component({
  selector: 'app-newsletter-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './newsletter-list.component.html'})
export class NewsletterListComponent implements OnInit, OnDestroy {

  newsletterService = inject(NewsletterService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  newsletters?: NewsletterDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@newsletter.delete.success:Newsletter was removed successfully.`,
      'newsletter.emails.newsletter.referenced': $localize`:@@newsletter.emails.newsletter.referenced:This entity is still referenced by Emails ${details?.id} via field Newsletter.`
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
    this.newsletterService.getAllNewsletters()
        .subscribe({
          next: (data) => this.newsletters = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.newsletterService.deleteNewsletter(id)
        .subscribe({
          next: () => this.router.navigate(['/newsletters'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/newsletters'], {
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
