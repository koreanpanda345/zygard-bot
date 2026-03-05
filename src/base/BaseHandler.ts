export default abstract class BaseHandler {
    public readonly name: string;
    constructor(name: string) {
        this.name = name;
    }

    // deno-lint-ignore no-explicit-any
    public handle(...args: any[]): any | Promise<any> {
        throw "Not yet implemented.";
    }
}