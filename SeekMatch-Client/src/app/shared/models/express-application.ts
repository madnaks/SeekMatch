export class ExpressApplication {
  lastName: string = '';
  firstName: string = '';
  email: string = '';
  phone?: string;
  cvPath?: string;
  jobApplicationId: string = '';

  constructor(init?: Partial<ExpressApplication>) {
    Object.assign(this, init);
  }
}