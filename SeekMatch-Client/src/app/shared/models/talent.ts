import { Education } from "./education";
import { Experience } from "./experience";
import { User } from "./user";

export class Talent extends User {

  public firstName: string = '';
  public lastName: string = '';
  public password: string= '';
  public profileTitle : string= '';
  public summary : string= '';
  public dateOfBirth : string | null = null;
  public address : string= '';
  public phone : string= '';
  public city : string= '';
  public state : string= '';
  public zip : string= '';
  public profilePicture : Uint8Array | null = null;
  public educations : Education[] = [];
  public experiences : Experience[] = [];

  constructor(init?:Partial<Talent>) {
    super();
    Object.assign(this, init);
  }
}
