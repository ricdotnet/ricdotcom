export class Commands extends Map {
    private static _instance: Commands

    constructor() {
        if (Commands._instance !== undefined) {
            console.warn('The commands collection is already instantiated.');
            return;
        }
        super();

        Commands._instance = this;
    }

    static instance() {
        return this._instance;
    }
}
