import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { DoctorsAvailableScheduleDTO } from 'app/doctors-available-schedule/doctors-available-schedule.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class DoctorsAvailableScheduleService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/doctorsAvailableSchedules';

  getAllDoctorsAvailableSchedules() {
    return this.http.get<DoctorsAvailableScheduleDTO[]>(this.resourcePath);
  }

  getDoctorsAvailableSchedule(id: number) {
    return this.http.get<DoctorsAvailableScheduleDTO>(this.resourcePath + '/' + id);
  }

  createDoctorsAvailableSchedule(doctorsAvailableScheduleDTO: DoctorsAvailableScheduleDTO) {
    return this.http.post<number>(this.resourcePath, doctorsAvailableScheduleDTO);
  }

  updateDoctorsAvailableSchedule(id: number, doctorsAvailableScheduleDTO: DoctorsAvailableScheduleDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, doctorsAvailableScheduleDTO);
  }

  deleteDoctorsAvailableSchedule(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getDoctorValues() {
    return this.http.get<Record<string, number>>(this.resourcePath + '/doctorValues')
        .pipe(map(transformRecordToMap));
  }

}
