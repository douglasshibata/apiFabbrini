export class HealthInsuranceDTO {

  constructor(data:Partial<HealthInsuranceDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  number?: string|null;
  type?: string|null;
  plan?: string|null;
  carrier?: string|null;
  active?: boolean|null;
  documents?: number[]|null;

}
