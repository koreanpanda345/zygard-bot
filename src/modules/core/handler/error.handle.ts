import { CommandInteraction, EmbedBuilder, Message, TextChannel } from "discord.js";
import BaseHandler from "../../../base/BaseHandler.ts";

export default class HandleError extends BaseHandler {
    constructor() {
        super(HandleError.name);
    }

    override async handle(ctx: Message | CommandInteraction, error: any) {
        const embed = new EmbedBuilder();

        embed.setTitle("An error occurred while handling a command.");
        embed.setColor("Red");
        embed.setDescription(`\`\`\`${error instanceof Error ? error.stack : String(error)}\`\`\``);
        
        if (ctx instanceof Message) {
            await (ctx.channel as TextChannel).send({ embeds: [embed] });
        } else {
            await ctx.reply({ embeds: [embed] });
        }
    }
}