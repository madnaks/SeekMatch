import { JobOffer } from "./job-offer";

export class JobApplication {

  public id: string | undefined = undefined;
  public appliedAt: string | undefined = undefined;
  public talentId: string = '';
  public jobOfferId: string = '';
  public jobOfferDto: JobOffer | undefined = undefined;
  
  constructor(init?:Partial<JobApplication>) {
    Object.assign(this, init);
  }
}