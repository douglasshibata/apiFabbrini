import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { SpecialtyDTO } from 'app/specialty/specialty.model';


@Injectable({
  providedIn: 'root',
})
export class SpecialtyService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/v1/specialties';

  getAllSpecialties() {
    return this.http.get<SpecialtyDTO[]>(this.resourcePath);
  }

  getSpecialty(id: number) {
    return this.http.get<SpecialtyDTO>(this.resourcePath + '/' + id);
  }

  createSpecialty(specialtyDTO: SpecialtyDTO) {
    return this.http.post<number>(this.resourcePath, specialtyDTO);
  }

  updateSpecialty(id: number, specialtyDTO: SpecialtyDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, specialtyDTO);
  }

  deleteSpecialty(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
