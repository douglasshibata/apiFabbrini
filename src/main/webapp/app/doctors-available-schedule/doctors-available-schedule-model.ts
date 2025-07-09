export class DoctorsAvailableScheduleDTO {

  constructor(data:Partial<DoctorsAvailableScheduleDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  dayOfWeek?: string|null;
  startDateTime?: string|null;
  endDateTime?: string|null;
  interval?: string|null;
  active?: boolean|null;
  doctor?: number|null;

}
