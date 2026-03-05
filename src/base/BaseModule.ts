// deno-lint-ignore-file no-explicit-any
import BaseCommand from "./BaseCommand.ts";
import BaseEvent from "./BaseEvent.ts";
import { Collection } from "discord.js";
import BaseMonitor from "./BaseMonitor.ts";

export default abstract class BaseModule {
    public readonly name: string;
    public description: string = "No description!";
    public isEnabled: boolean = true;
    public readonly commands: Collection<string, BaseCommand> = new Collection();
    public readonly events: Collection<string, BaseEvent> = new Collection();
    public readonly monitors: Collection<string, BaseMonitor> = new Collection();
    public readonly tasks: Collection<string, any> = new Collection();
    public constructor(name: string) {
        this.name = name;
    }
}