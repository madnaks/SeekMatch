import { User } from "./user";

export class Recruiter extends User {

  public firstName: string = '';
  public lastName: string = '';
  public password: string = '';
  public isFreelancer: boolean = false;

  constructor(init?:Partial<Recruiter>) {
    super();
    Object.assign(this, init);
  }
}
