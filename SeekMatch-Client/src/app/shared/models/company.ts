export class Company {
  
  public name: string = '';
  public phone: string = '';
  public address: string = '';
  public country: string = '';
  public region: string | null = null;
  public city: string | null = null;
  public description: string = '';
  public website: string = '';

  constructor(init?:Partial<Company>) {
    Object.assign(this, init);
  }
}
