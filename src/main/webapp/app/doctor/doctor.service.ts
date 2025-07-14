import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { DoctorDTO } from 'app/doctor/doctor.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class DoctorService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/doctors';

  getAllDoctors() {
    return this.http.get<DoctorDTO[]>(this.resourcePath);
  }

  getDoctor(id: number) {
    return this.http.get<DoctorDTO>(this.resourcePath + '/' + id);
  }

  createDoctor(doctorDTO: DoctorDTO) {
    return this.http.post<number>(this.resourcePath, doctorDTO);
  }

  updateDoctor(id: number, doctorDTO: DoctorDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, doctorDTO);
  }

  deleteDoctor(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getUserValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/userValues')
        .pipe(map(transformRecordToMap));
  }

  getSpecialtyValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/specialtyValues')
        .pipe(map(transformRecordToMap));
  }

  getHealthinsurancesValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/healthinsurancesValues')
        .pipe(map(transformRecordToMap));
  }

  getDocumentsValues() {
    return this.http.get<Record<string, number>>(this.resourcePath + '/documentsValues')
        .pipe(map(transformRecordToMap));
  }

}
