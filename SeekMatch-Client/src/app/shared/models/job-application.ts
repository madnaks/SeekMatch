export class JobApplication {

  public id: string | undefined = undefined;
  public talentId: string = '';
  public JobOfferId: string = '';
  
  constructor(init?:Partial<JobApplication>) {
    Object.assign(this, init);
  }
}