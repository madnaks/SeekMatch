export class Talent {

  public firstName: string = '';
  public lastName: string = '';
  public email: string = '';
  public password: string= '';
  public profileTitle : string= '';
  public dateOfBirth : Date | null = null;
  public address : string= '';
  public phone : string= '';
  public city : string= '';
  public state : string= '';
  public zip : string= '';

  constructor(init?:Partial<Talent>) {
    Object.assign(this, init);
  }
}
