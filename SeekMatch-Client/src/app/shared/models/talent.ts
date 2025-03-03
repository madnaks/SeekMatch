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
  public phone : string= '';
  public country : string= '';
  public region : number | null = null;
  public city : number | null = null;
  public profilePicture : Uint8Array | null = null;
  public educations : Education[] = [];
  public experiences : Experience[] = [];

  constructor(init?:Partial<Talent>) {
    super();
    Object.assign(this, init);
  }
}
