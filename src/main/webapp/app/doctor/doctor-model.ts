export class DoctorDTO {

  constructor(data:Partial<DoctorDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  conselho?: string|null;
  ufconselho?: string|null;
  registro?: string|null;
  title?: string|null;
  user?: number|null;
  specialty?: number|null;
  healthinsurances?: number[]|null;
  documents?: number[]|null;

}
