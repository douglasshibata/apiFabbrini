export class ScheduleDTO {

  constructor(data:Partial<ScheduleDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  appoimentTime?: string|null;
  videoHashLink?: string|null;
  note?: string|null;
  patient?: number|null;
  doctorsAvailableSchedule?: number|null;

}
