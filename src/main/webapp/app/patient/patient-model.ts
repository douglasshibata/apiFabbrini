export class PatientDTO {

  constructor(data:Partial<PatientDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  fullname?: string|null;
  cpf?: string|null;
  rg?: string|null;
  socialname?: string|null;
  user?: number|null;
  documents?: number[]|null;
  healthInsurances?: number[]|null;

}
