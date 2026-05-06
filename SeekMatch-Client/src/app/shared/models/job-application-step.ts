import { JobApplicationStatus } from "../enums/enums";

export class JobApplicationStep {
    public id: string | undefined = undefined;
    public createdAt: string | null = null;
    public status: JobApplicationStatus = JobApplicationStatus.Submitted;
    public note: string | null = null;
}