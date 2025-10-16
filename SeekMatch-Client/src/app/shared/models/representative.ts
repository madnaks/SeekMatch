import { Setting } from "./setting";
import { User } from "./user";

export class Representative extends User {

  public firstName: string = '';
  public lastName: string = '';
  public password: string = '';
  public position: string = '';
  public setting: Setting = new Setting();

  constructor(init?: Partial<Representative>) {
    super();
    Object.assign(this, init);
  }
}
