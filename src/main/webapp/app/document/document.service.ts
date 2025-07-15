import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { DocumentDTO } from 'app/document/document.model';


@Injectable({
  providedIn: 'root',
})
export class DocumentService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/v1/v1/v1/documents';

  getAllDocuments() {
    return this.http.get<DocumentDTO[]>(this.resourcePath);
  }

  getDocument(id: number) {
    return this.http.get<DocumentDTO>(this.resourcePath + '/' + id);
  }

  createDocument(documentDTO: DocumentDTO) {
    return this.http.post<number>(this.resourcePath, documentDTO);
  }

  updateDocument(id: number, documentDTO: DocumentDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, documentDTO);
  }

  deleteDocument(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
