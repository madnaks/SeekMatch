export class Company {
  
  public name: string = '';
  public phoneNumber: string = '';
  public address: string = '';

  constructor(init?:Partial<Company>) {
    Object.assign(this, init);
  }
}
