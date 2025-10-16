export class Setting {
    constructor(init?: Partial<Setting>) {
        Object.assign(this, init);
    }
    public language: string = '';
}
