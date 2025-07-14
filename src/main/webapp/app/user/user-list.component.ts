import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { UserService } from 'app/user/user.service';
import { UserDTO } from 'app/user/user.model';


@Component({
  selector: 'app-user-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.component.html'})
export class UserListComponent implements OnInit, OnDestroy {

  userService = inject(UserService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  users?: UserDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@user.delete.success:User was removed successfully.`,
      'user.phones.user.referenced': $localize`:@@user.phones.user.referenced:This entity is still referenced by Phones ${details?.id} via field User.`,
      'user.address.user.referenced': $localize`:@@user.address.user.referenced:This entity is still referenced by Address ${details?.id} via field User.`,
      'user.doctor.user.referenced': $localize`:@@user.doctor.user.referenced:This entity is still referenced by Doctor ${details?.id} via field User.`,
      'user.patient.user.referenced': $localize`:@@user.patient.user.referenced:This entity is still referenced by Patient ${details?.id} via field User.`
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
    this.userService.getAllUsers()
        .subscribe({
          next: (data) => this.users = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.userService.deleteUser(id)
        .subscribe({
          next: () => this.router.navigate(['/users'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/users'], {
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
