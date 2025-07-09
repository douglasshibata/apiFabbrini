export class EmailsDTO {

  constructor(data:Partial<EmailsDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  email?: string|null;
  active?: boolean|null;
  newsletter?: number|null;

}
