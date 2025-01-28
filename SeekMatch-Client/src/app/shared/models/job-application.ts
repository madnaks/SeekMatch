import { JobApplicationStatus } from "../enums/enums";

export class JobApplication {

  public id: string | undefined = undefined;
  public appliedAt: string | undefined = undefined;
  public talentId: string = '';
  public talentFullName: string = '';
  public jobOfferId: string = '';
  public jobOfferTitle: string = '';
  public status: JobApplicationStatus = JobApplicationStatus.Pending;
  
  constructor(init?:Partial<JobApplication>) {
    Object.assign(this, init);
  }
}