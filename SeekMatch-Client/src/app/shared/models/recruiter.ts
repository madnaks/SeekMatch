import { Setting } from "./setting";
import { User } from "./user";

export class Recruiter extends User {

  public firstName: string = '';
  public lastName: string = '';
  public password: string = '';
  public isFreelancer: boolean = false;
  public canDeleteJobOffer?: boolean;
  public setting: Setting = new Setting();

  constructor(init?: Partial<Recruiter>) {
    super();
    Object.assign(this, init);
  }
}
