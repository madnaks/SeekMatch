import { JobApplicationStatus } from "../enums/enums";
import { ExpressApplication } from "./express-application";
import { JobApplicationStep } from "./job-application-step";

export class JobApplication {

  public id: string | undefined = undefined;
  public appliedAt: string | undefined = undefined;
  public talentId: string = '';
  public talentFullName: string = '';
  public jobOfferId: string = '';
  public jobOfferTitle: string = '';
  public status: JobApplicationStatus = JobApplicationStatus.Submitted;
  public rejectionReason: string = '';
  public isExpress: boolean = false;
  public filePath?: string;
  public interviewPlatform?: string;
  public interviewDate?: string;
  public expressApplication?: ExpressApplication = new ExpressApplication();
  public jobApplicationSteps : JobApplicationStep[] = [];

  constructor(init?:Partial<JobApplication>) {
    Object.assign(this, init);
  }
}