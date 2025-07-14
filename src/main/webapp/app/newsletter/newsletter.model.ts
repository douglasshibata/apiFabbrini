export class NewsletterDTO {

  constructor(data:Partial<NewsletterDTO>) {
    Object.assign(this, data);
    if (data.file) {
      this.file = JSON.parse(data.file);
    }
  }

  id?: number|null;
  title?: string|null;
  content?: string|null;
  file?: any|null;
  deliveryDate?: string|null;

}
