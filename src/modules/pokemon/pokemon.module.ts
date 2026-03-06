import BaseModule from "../../base/BaseModule.ts";
import InfoCommand from "./commands/info.command.ts";
import PCCommand from "./commands/pc.command.ts";
import StartCommand from "./commands/start.command.ts";

export default class PokemonModule extends BaseModule {
    constructor() {
        super(PokemonModule.name);
        this.description = "This module contains all of the pokemon related commands and functions.";
        this.isEnabled = true;

        this.commands.set("start", new StartCommand());
        this.commands.set("info", new InfoCommand());
        this.commands.set("pc", new PCCommand());
    }
}