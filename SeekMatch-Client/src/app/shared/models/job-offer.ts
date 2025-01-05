import { JobType } from "../enums/enums";

export class JobOffer {

  public id: string | undefined = undefined;
  public title: string = '';
  public description: string = '';
  public companyName: string = '';
  public location: string = '';
  public salary: string = '';
  public postedAt : Date | null = null;
  public expiresAt : Date | null = null;
  public type: JobType = JobType.FullTime;
  public isActive: Boolean = false;
  
  constructor(init?:Partial<JobOffer>) {
    Object.assign(this, init);
  }
}
