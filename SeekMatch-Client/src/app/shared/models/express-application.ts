export class ExpressApplication {
  lastName: string = '';
  firstName: string = '';
  email: string = '';
  phone?: string;
  filePath?: string;
  jobApplicationId: string = '';

  constructor(init?: Partial<ExpressApplication>) {
    Object.assign(this, init);
  }
}