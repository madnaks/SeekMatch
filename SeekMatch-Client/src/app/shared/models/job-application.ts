import { JobOffer } from "./job-offer";

export class JobApplication {

  public id: string | undefined = undefined;
  public appliedAt: string | undefined = undefined;
  public talentId: string = '';
  public talentFullName: string = '';
  public jobOfferId: string = '';
  public jobOfferTitle: string = '';
  
  constructor(init?:Partial<JobApplication>) {
    Object.assign(this, init);
  }
}