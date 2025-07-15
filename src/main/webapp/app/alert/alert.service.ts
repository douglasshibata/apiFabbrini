import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AlertDTO } from 'app/alert/alert.model';


@Injectable({
  providedIn: 'root',
})
export class AlertService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/v1/v1/alerts';

  getAllAlerts() {
    return this.http.get<AlertDTO[]>(this.resourcePath);
  }

  getAlert(id: number) {
    return this.http.get<AlertDTO>(this.resourcePath + '/' + id);
  }

  createAlert(alertDTO: AlertDTO) {
    return this.http.post<number>(this.resourcePath, alertDTO);
  }

  updateAlert(id: number, alertDTO: AlertDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, alertDTO);
  }

  deleteAlert(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
