import { User } from "./user";

export class Representative extends User {

  public firstName: string = '';
  public lastName: string = '';
  public password: string = '';
  public position: string = '';

  constructor(init?:Partial<Representative>) {
    super();
    Object.assign(this, init);
  }
}
