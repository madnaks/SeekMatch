export class Education {

  public id: string = '';
  public institution: string = '';
  public diploma: string = '';
  public domain: string = '';
  public startYear : number = 0;
  public startMonth : number = 0;
  public finishYear : number = 0;
  public finishMonth : number = 0;
  public currentlyStudying : boolean = false;

  constructor(init?:Partial<Education>) {
    Object.assign(this, init);
  }
}
