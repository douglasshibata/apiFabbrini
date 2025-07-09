export class SpecialtyDTO {

  constructor(data:Partial<SpecialtyDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  description?: string|null;

}
