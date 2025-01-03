import { JobType } from "../enums/enums";

export class Experience {

  public id: string | undefined = undefined;
  public companyName: string = '';
  public jobTitle: string = '';
  public startYear : number = 0;
  public startMonth : number = 0;
  public endYear : number = 0;
  public endMonth : number = 0;
  public currentlyWorking : boolean = false;
  public description: string = '';
  public type: JobType = JobType.FullTime;

  constructor(init?:Partial<Experience>) {
    Object.assign(this, init);
  }
}
