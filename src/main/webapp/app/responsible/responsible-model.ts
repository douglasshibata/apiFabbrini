export class ResponsibleDTO {

  constructor(data:Partial<ResponsibleDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  degreeOfRelatedness?: string|null;
  phones?: number|null;
  patient?: number|null;

}
