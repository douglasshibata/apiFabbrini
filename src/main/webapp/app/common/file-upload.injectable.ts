import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root',
})
export class FileUploadService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/fileUpload';

  upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FileData>(this.resourcePath, formData);
  }

}

export class FileData {
  uid?: string;
  fileName?: string;
}
