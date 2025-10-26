export class Resume {

  public id: string | undefined = undefined;
  public title: string = '';
  public fileUrl: string = '';
  public isPrimary: boolean = false;

  constructor(init?:Partial<Resume>) {
    Object.assign(this, init);
  }
}
