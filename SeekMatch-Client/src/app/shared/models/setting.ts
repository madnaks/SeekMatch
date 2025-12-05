export class Setting {
    public language: string = 'fr';

    constructor(init?: Partial<Setting>) {
        Object.assign(this, init);
    }
}
