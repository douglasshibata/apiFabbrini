import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { PasswordTokenService } from 'app/password-token/password-token.service';
import { PasswordTokenDTO } from 'app/password-token/password-token.model';


@Component({
  selector: 'app-password-token-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './password-token-list.component.html'})
export class PasswordTokenListComponent implements OnInit, OnDestroy {

  passwordTokenService = inject(PasswordTokenService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  passwordTokens?: PasswordTokenDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@passwordToken.delete.success:Password Token was removed successfully.`    };
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
    this.passwordTokenService.getAllPasswordTokens()
        .subscribe({
          next: (data) => this.passwordTokens = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.passwordTokenService.deletePasswordToken(id)
        .subscribe({
          next: () => this.router.navigate(['/passwordTokens'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
