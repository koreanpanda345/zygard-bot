import BaseCommand from "../../../base/BaseCommand.ts";
import BaseGuard from "../../../base/BaseGuard.ts";
import { ChatInputCommandInteraction } from "discord.js";
export default class DevOnlyGuard extends BaseGuard {
    constructor() {
        super(DevOnlyGuard.name);
    }

    override async canExecute(interaction: ChatInputCommandInteraction, command: BaseCommand): Promise<boolean> {
        if (!command.devOnly) return true;

        const devIds = ["304446682081525772"];

        if (devIds.includes(interaction.user.id)) return true;

        await interaction.reply({
            content: "You can not use dev commands due to not being a developer of the bot.",
            flags: ["Ephemeral"],
        });

        return false;
    }
}