import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ResponsibleDTO } from 'app/responsible/responsible.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class ResponsibleService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/v1/responsibles';

  getAllResponsibles() {
    return this.http.get<ResponsibleDTO[]>(this.resourcePath);
  }

  getResponsible(id: number) {
    return this.http.get<ResponsibleDTO>(this.resourcePath + '/' + id);
  }

  createResponsible(responsibleDTO: ResponsibleDTO) {
    return this.http.post<number>(this.resourcePath, responsibleDTO);
  }

  updateResponsible(id: number, responsibleDTO: ResponsibleDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, responsibleDTO);
  }

  deleteResponsible(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getPhonesValues() {
    return this.http.get<Record<string, number>>(this.resourcePath + '/phonesValues')
        .pipe(map(transformRecordToMap));
  }

  getPatientValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/patientValues')
        .pipe(map(transformRecordToMap));
  }

}
