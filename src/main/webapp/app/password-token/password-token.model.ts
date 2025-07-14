export class PasswordTokenDTO {

  constructor(data:Partial<PasswordTokenDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  token?: string|null;
  expirationTime?: string|null;
  typeToken?: string|null;
  used?: boolean|null;

}
