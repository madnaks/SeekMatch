import { User } from "./user";

export class Talent extends User {

  public firstName: string = '';
  public lastName: string = '';
  public password: string= '';
  public profileTitle : string= '';
  public dateOfBirth : string | null = null;
  public address : string= '';
  public phone : string= '';
  public city : string= '';
  public state : string= '';
  public zip : string= '';
  public profilePicture : Uint8Array | null = null;

  constructor(init?:Partial<Talent>) {
    super();
    Object.assign(this, init);
  }
}
