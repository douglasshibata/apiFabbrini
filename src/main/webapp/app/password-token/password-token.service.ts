import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { PasswordTokenDTO } from 'app/password-token/password-token.model';


@Injectable({
  providedIn: 'root',
})
export class PasswordTokenService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/v1/passwordTokens';

  getAllPasswordTokens() {
    return this.http.get<PasswordTokenDTO[]>(this.resourcePath);
  }

  getPasswordToken(id: number) {
    return this.http.get<PasswordTokenDTO>(this.resourcePath + '/' + id);
  }

  createPasswordToken(passwordTokenDTO: PasswordTokenDTO) {
    return this.http.post<number>(this.resourcePath, passwordTokenDTO);
  }

  updatePasswordToken(id: number, passwordTokenDTO: PasswordTokenDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, passwordTokenDTO);
  }

  deletePasswordToken(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
