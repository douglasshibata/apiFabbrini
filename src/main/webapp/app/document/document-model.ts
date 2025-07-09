export class DocumentDTO {

  constructor(data:Partial<DocumentDTO>) {
    Object.assign(this, data);
    if (data.file) {
      this.file = JSON.parse(data.file);
    }
  }

  id?: number|null;
  documentType?: string|null;
  file?: any|null;
  filename?: string|null;
  fileType?: string|null;

}
