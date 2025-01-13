export class User {
    
    public id: string | undefined = undefined;
    public email: string = '';

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
}