export class PhonesDTO {

  constructor(data:Partial<PhonesDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  ddd?: string|null;
  number?: string|null;
  user?: number|null;

}
