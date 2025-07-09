export class RoleDTO {

  constructor(data:Partial<RoleDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  type?: string|null;

}
