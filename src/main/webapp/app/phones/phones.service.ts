import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { PhonesDTO } from 'app/phones/phones.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class PhonesService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/v1/v1/phoness';

  getAllPhoneses() {
    return this.http.get<PhonesDTO[]>(this.resourcePath);
  }

  getPhones(id: number) {
    return this.http.get<PhonesDTO>(this.resourcePath + '/' + id);
  }

  createPhones(phonesDTO: PhonesDTO) {
    return this.http.post<number>(this.resourcePath, phonesDTO);
  }

  updatePhones(id: number, phonesDTO: PhonesDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, phonesDTO);
  }

  deletePhones(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getUserValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/userValues')
        .pipe(map(transformRecordToMap));
  }

}
