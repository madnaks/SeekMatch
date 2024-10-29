export class Education {

  public id: string | undefined = undefined;
  public institution: string = '';
  public diploma: string = '';
  public domain: string = '';
  public startYear : number = 0;
  public startMonth : number = 0;
  public endYear : number = 0;
  public endMonth : number = 0;
  public currentlyStudying : boolean = false;

  constructor(init?:Partial<Education>) {
    Object.assign(this, init);
  }
}
