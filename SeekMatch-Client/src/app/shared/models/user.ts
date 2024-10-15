export class User {
    public email: string = '';
    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
}