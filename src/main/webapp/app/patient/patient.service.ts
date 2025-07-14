import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { PatientDTO } from 'app/patient/patient.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class PatientService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/patients';

  getAllPatients() {
    return this.http.get<PatientDTO[]>(this.resourcePath);
  }

  getPatient(id: number) {
    return this.http.get<PatientDTO>(this.resourcePath + '/' + id);
  }

  createPatient(patientDTO: PatientDTO) {
    return this.http.post<number>(this.resourcePath, patientDTO);
  }

  updatePatient(id: number, patientDTO: PatientDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, patientDTO);
  }

  deletePatient(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getUserValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/userValues')
        .pipe(map(transformRecordToMap));
  }

  getDocumentsValues() {
    return this.http.get<Record<string, number>>(this.resourcePath + '/documentsValues')
        .pipe(map(transformRecordToMap));
  }

  getHealthInsurancesValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/healthInsurancesValues')
        .pipe(map(transformRecordToMap));
  }

}
