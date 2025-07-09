export class AddressDTO {

  constructor(data:Partial<AddressDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  address?: string|null;
  cep?: string|null;
  complement?: string|null;
  neighbourhood?: string|null;
  number?: number|null;
  city?: string|null;
  uf?: string|null;
  user?: number|null;

}
