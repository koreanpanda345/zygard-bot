import { discordClient } from "../../../../main.ts";
import BaseMonitor from "../../../base/BaseMonitor.ts";
import { ChatInputCommandInteraction, Interaction } from "discord.js";
import CommandCooldownGuard from "../guards/commandCooldown.guard.ts";
import DevOnlyGuard from "../guards/devOnly.guard.ts";
import logger from "../../../utils/logger.ts";
import HandleError from "../handler/error.handle.ts";
import HasTrainerGuard from "../../trainer/guards/hasTrainer.guard.ts";
export default class HandleCommandsMonitor extends BaseMonitor {
    constructor() {
        super(HandleCommandsMonitor.name);
    }

    public override async invoke(interaction: ChatInputCommandInteraction) {
        if (interaction.user.bot) return;

        const command = discordClient.getCommand(interaction.commandName);
        
        if (!command) return;

        if (!await discordClient.guards.get(CommandCooldownGuard.name)?.canExecute(interaction, command)) return;

        if (!await discordClient.guards.get(DevOnlyGuard.name)?.canExecute(interaction, command)) return;
        if (typeof command.flags?.hasTrainer === "number" && !await discordClient.guards.get(HasTrainerGuard.name)?.canExecute(interaction.user.id, interaction, command)) return;

        try {
            await command.invoke(interaction);
        } catch (error) {
            logger.error(`[${HandleCommandsMonitor.name}]`, `Error executing command ${command.data.name}:`, error);
            await discordClient.handlers.get(HandleError.name)?.handle(interaction, error);
        }
    }
}