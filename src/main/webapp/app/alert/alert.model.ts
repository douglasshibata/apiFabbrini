export class AlertDTO {

  constructor(data:Partial<AlertDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  description?: string|null;
  expirationTime?: string|null;
  active?: boolean|null;
  alertType?: string|null;

}
