export default abstract class BaseGuard {
    public readonly name: string;
    constructor(name: string) {
        this.name = name;
    }

    // deno-lint-ignore no-explicit-any
    public canExecute(...args: any[]): boolean | Promise<boolean> {
        return true;
    }
};