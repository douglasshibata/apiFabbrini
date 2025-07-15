import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { HealthInsuranceDTO } from 'app/health-insurance/health-insurance.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class HealthInsuranceService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/v1/v1/v1/healthInsurances';

  getAllHealthInsurances() {
    return this.http.get<HealthInsuranceDTO[]>(this.resourcePath);
  }

  getHealthInsurance(id: number) {
    return this.http.get<HealthInsuranceDTO>(this.resourcePath + '/' + id);
  }

  createHealthInsurance(healthInsuranceDTO: HealthInsuranceDTO) {
    return this.http.post<number>(this.resourcePath, healthInsuranceDTO);
  }

  updateHealthInsurance(id: number, healthInsuranceDTO: HealthInsuranceDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, healthInsuranceDTO);
  }

  deleteHealthInsurance(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getDocumentsValues() {
    return this.http.get<Record<string, number>>(this.resourcePath + '/documentsValues')
        .pipe(map(transformRecordToMap));
  }

}
