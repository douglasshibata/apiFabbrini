import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ScheduleDTO } from 'app/schedule/schedule.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class ScheduleService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/schedules';

  getAllSchedules() {
    return this.http.get<ScheduleDTO[]>(this.resourcePath);
  }

  getSchedule(id: number) {
    return this.http.get<ScheduleDTO>(this.resourcePath + '/' + id);
  }

  createSchedule(scheduleDTO: ScheduleDTO) {
    return this.http.post<number>(this.resourcePath, scheduleDTO);
  }

  updateSchedule(id: number, scheduleDTO: ScheduleDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, scheduleDTO);
  }

  deleteSchedule(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getPatientValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/patientValues')
        .pipe(map(transformRecordToMap));
  }

  getDoctorsAvailableScheduleValues() {
    return this.http.get<Record<string, number>>(this.resourcePath + '/doctorsAvailableScheduleValues')
        .pipe(map(transformRecordToMap));
  }

}
