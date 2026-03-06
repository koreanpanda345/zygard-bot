import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default abstract class BaseCommand {
    data: SlashCommandBuilder;
    cooldown?: number;
    devOnly?: boolean;
    flags?: {
        hasTrainer?: number; // 0 = false, 1 = true
    };

    constructor(name: string, description: string, builder: (data: SlashCommandBuilder) => SlashCommandBuilder) {
        this.data = new SlashCommandBuilder();
        this.data.setName(name);
        this.data.setDescription(description);
        builder(this.data);
    }

    // deno-lint-ignore no-explicit-any
    public invoke(interaction: ChatInputCommandInteraction): any | Promise<any> {
        throw "not yet implemented";
    }
}