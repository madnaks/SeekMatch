import { JobOffer } from "./job-offer";

export class Bookmark {
    public id: string | undefined = undefined;
    public jobOfferId: string = '';
    public jobOffer: JobOffer | null = null;
    public createdAt: string | null = null;
    public talentId: string = '';
}