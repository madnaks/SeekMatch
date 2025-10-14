import { JobType, WorkplaceType } from "../enums/enums";
import { formatDateToISO } from "../utils";
import { JobApplication } from "./job-application";

export class JobOffer {

  public id: string | undefined = undefined;
  public title: string = '';
  public description: string = '';
  public positionDetails: string = '';
  public qualifications: string = '';
  public additionalRequirements: string = '';
  public companyInfo: string = '';
  public companyName: string = '';
  public location: string = '';
  public salary: string = '';
  public postedAt : string | null = null;
  public expiresAt : string | null = null;
  public type: JobType = JobType.FullTime;
  public workplaceType: WorkplaceType = WorkplaceType.OnSite;
  public isActive: Boolean = false;
  public jobApplications : JobApplication[] = [];
  
  constructor(init?:Partial<JobOffer>) {
    Object.assign(this, init);

    this.postedAt = formatDateToISO(this.postedAt);
    this.expiresAt = formatDateToISO(this.expiresAt);
  }
}
