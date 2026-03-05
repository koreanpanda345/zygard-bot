import BaseModule from "../../base/BaseModule.ts";
import PingCommand from "./commands/ping.command.ts";
import ClientReadyEvent from "./events/clientReady.event.ts";
import InteractionCreateEvent from "./events/interactionCreate.event.ts";
import HandleCommandsMonitor from "./monitors/handleCommands.monitor.ts";

export default class CoreModule extends BaseModule {
    constructor() {
        super(CoreModule.name);
        this.description = "This contains all of the core functions for the bot to function.";
        this.isEnabled = true;

        this.commands.set("ping", new PingCommand());

        this.events.set(InteractionCreateEvent.name, new InteractionCreateEvent());
        this.events.set(ClientReadyEvent.name, new ClientReadyEvent());

        this.monitors.set(HandleCommandsMonitor.name, new HandleCommandsMonitor());
    }
}