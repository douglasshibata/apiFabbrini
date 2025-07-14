import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AddressService } from 'app/address/address.service';
import { AddressDTO } from 'app/address/address.model';


@Component({
  selector: 'app-address-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './address-list.component.html'})
export class AddressListComponent implements OnInit, OnDestroy {

  addressService = inject(AddressService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  addresses?: AddressDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@address.delete.success:Address was removed successfully.`    };
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
    this.addressService.getAllAddresses()
        .subscribe({
          next: (data) => this.addresses = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.addressService.deleteAddress(id)
        .subscribe({
          next: () => this.router.navigate(['/addresses'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
