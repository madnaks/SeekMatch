import { JobApplicationStatus } from "../enums/enums";
import { ExpressApplication } from "./express-application";

export class JobApplication {

  public id: string | undefined = undefined;
  public appliedAt: string | undefined = undefined;
  public talentId: string = '';
  public talentFullName: string = '';
  public jobOfferId: string = '';
  public jobOfferTitle: string = '';
  public status: JobApplicationStatus = JobApplicationStatus.Submitted;
  public rejectionReason: string = '';
  public isExpress: boolean= false;
  public expressApplication?: ExpressApplication = new ExpressApplication();

  constructor(init?:Partial<JobApplication>) {
    Object.assign(this, init);
  }
}