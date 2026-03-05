export default abstract class BaseEvent {
    public readonly name: string;
    onlyOnce?: boolean;
    constructor(name: string, onlyOnce: boolean = false) {
        this.name = name;
        this.onlyOnce = onlyOnce;
    }

    // deno-lint-ignore no-explicit-any
    public invoke(...args: any[]): void | Promise<void> {
        throw "Not yet implemented.";
    }
}