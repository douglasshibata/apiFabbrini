import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { DocumentService } from 'app/document/document.service';
import { DocumentDTO } from 'app/document/document.model';


@Component({
  selector: 'app-document-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './document-list.component.html'})
export class DocumentListComponent implements OnInit, OnDestroy {

  documentService = inject(DocumentService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  documents?: DocumentDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@document.delete.success:Document was removed successfully.`    };
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
    this.documentService.getAllDocuments()
        .subscribe({
          next: (data) => this.documents = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.documentService.deleteDocument(id)
        .subscribe({
          next: () => this.router.navigate(['/documents'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
