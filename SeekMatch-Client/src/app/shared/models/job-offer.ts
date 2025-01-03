import { JobType } from "../enums/enums";

export class JobOffer {

  public id: string | undefined = undefined;
  public title: string = '';
  public description: string = '';
  public companyName: string = '';
  public location: string = '';
  public salary: number = 0;
  public postedAt : Date = new Date();
  public expiresAt : Date = new Date();
  public type: JobType = JobType.FullTime;
  public isActive: Boolean = false;
  
  constructor(init?:Partial<JobOffer>) {
    Object.assign(this, init);
  }
}
