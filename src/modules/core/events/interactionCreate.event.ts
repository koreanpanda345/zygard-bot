import BaseEvent from "../../../base/BaseEvent.ts";
import { Interaction } from "discord.js";
import {discordClient} from "../../../../main.ts";
import HandleCommandsMonitor from "../monitors/handleCommands.monitor.ts";

export default class InteractionCreateEvent extends BaseEvent {
    constructor() {
        super('interactionCreate');
    }

    public override async invoke(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;
        await discordClient.getMonitor(HandleCommandsMonitor.name).invoke(interaction);
    }
}