import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { NewsletterDTO } from 'app/newsletter/newsletter.model';


@Injectable({
  providedIn: 'root',
})
export class NewsletterService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/v1/v1/newsletters';

  getAllNewsletters() {
    return this.http.get<NewsletterDTO[]>(this.resourcePath);
  }

  getNewsletter(id: number) {
    return this.http.get<NewsletterDTO>(this.resourcePath + '/' + id);
  }

  createNewsletter(newsletterDTO: NewsletterDTO) {
    return this.http.post<number>(this.resourcePath, newsletterDTO);
  }

  updateNewsletter(id: number, newsletterDTO: NewsletterDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, newsletterDTO);
  }

  deleteNewsletter(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
