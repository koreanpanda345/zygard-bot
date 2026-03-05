export default abstract class BaseMonitor {
    public readonly name: string;
    constructor(name: string) {
        this.name = name;
    }

    // deno-lint-ignore no-explicit-any
    public invoke(...args: any[]): any | Promise<any> {
        throw "Not yet implemented";
    }
}