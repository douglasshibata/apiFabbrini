export class UserDTO {

  constructor(data:Partial<UserDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  email?: string|null;
  password?: string|null;
  fullname?: string|null;
  active?: boolean|null;
  socialname?: string|null;
  cpf?: string|null;
  crm?: string|null;
  countAccess?: number|null;
  role?: number|null;

}
