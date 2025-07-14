import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MedicalRecordDTO } from 'app/medical-record/medical-record.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class MedicalRecordService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/medicalRecords';

  getAllMedicalRecords() {
    return this.http.get<MedicalRecordDTO[]>(this.resourcePath);
  }

  getMedicalRecord(id: number) {
    return this.http.get<MedicalRecordDTO>(this.resourcePath + '/' + id);
  }

  createMedicalRecord(medicalRecordDTO: MedicalRecordDTO) {
    return this.http.post<number>(this.resourcePath, medicalRecordDTO);
  }

  updateMedicalRecord(id: number, medicalRecordDTO: MedicalRecordDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, medicalRecordDTO);
  }

  deleteMedicalRecord(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getScheduleValues() {
    return this.http.get<Record<string, number>>(this.resourcePath + '/scheduleValues')
        .pipe(map(transformRecordToMap));
  }

}
