export class MedicalRecordDTO {

  constructor(data:Partial<MedicalRecordDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  notes?: string|null;
  schedule?: number|null;

}
