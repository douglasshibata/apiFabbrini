import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { EmailsDTO } from 'app/emails/emails.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class EmailsService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/emailss';

  getAllEmailses() {
    return this.http.get<EmailsDTO[]>(this.resourcePath);
  }

  getEmails(id: number) {
    return this.http.get<EmailsDTO>(this.resourcePath + '/' + id);
  }

  createEmails(emailsDTO: EmailsDTO) {
    return this.http.post<number>(this.resourcePath, emailsDTO);
  }

  updateEmails(id: number, emailsDTO: EmailsDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, emailsDTO);
  }

  deleteEmails(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getNewsletterValues() {
    return this.http.get<Record<string, number>>(this.resourcePath + '/newsletterValues')
        .pipe(map(transformRecordToMap));
  }

}
