import { CommandInteraction } from "discord.js";
import BaseCommand from "../../../base/BaseCommand.ts";
import BaseGuard from "../../../base/BaseGuard.ts";
import Database from "../../../core/Database.ts";
export default class HasTrainerGuard extends BaseGuard {
    constructor() {
        super(HasTrainerGuard.name);
    }

    public override async canExecute(discordUserId: string, interaction: CommandInteraction, command: BaseCommand) {
        const trainer = await Database.TrainerCollection.findOne({ discordUserId });
        if (command.flags?.hasTrainer === 0 && !trainer) return true;
        else if (command.flags?.hasTrainer === 1 && trainer) return true;

        await interaction.reply({
            content: command.flags?.hasTrainer === 1
                ? "You need to be a trainer to use this command! Use `/start` to start your pokemon journey!"
                : "You already are a trainer, you can not use this command!",
            flags: ["Ephemeral"],
        })

        return false;
    }
}