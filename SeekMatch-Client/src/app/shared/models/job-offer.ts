import { JobType } from "../enums/enums";
import { formatDateToISO } from "../utils";

export class JobOffer {

  public id: string | undefined = undefined;
  public title: string = '';
  public description: string = '';
  public companyName: string = '';
  public location: string = '';
  public salary: string = '';
  public postedAt : string | null = null;
  public expiresAt : string | null = null;
  public type: JobType = JobType.FullTime;
  public isActive: Boolean = false;
  
  constructor(init?:Partial<JobOffer>) {
    Object.assign(this, init);

    this.postedAt = formatDateToISO(this.postedAt);
    this.expiresAt = formatDateToISO(this.expiresAt);
  }
}
