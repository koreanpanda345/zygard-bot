import { REST, Routes, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { discordClient } from "../../../../main.ts";
import BaseHandler from "../../../base/BaseHandler.ts";
import logger from "../../../utils/logger.ts";

export default class HandleReloadCommands extends BaseHandler {

    constructor() {
        super(HandleReloadCommands.name);
    }

    public override async handle() {
        const commandData: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
        discordClient.modules.forEach((module) => {
            module.commands.forEach((command) => {
                commandData.push(command.data.toJSON());
            });
        });

        const rest = new REST({ version: "10" }).setToken(Deno.env.get("DISCORD_CLIENT_TOKEN")!);
        
        try {
            logger.info(`[${HandleReloadCommands.name}]`, `Started refreshing ${commandData.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationGuildCommands(Deno.env.get("DISCORD_CLIENT_ID")!, Deno.env.get("DISCORD_GUILD_ID")!),
                { body: commandData },
            );
            //@ts-ignore
            logger.info(`[${HandleReloadCommands.name}]`, `Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            logger.error(`[${HandleReloadCommands.name}]`, `Error reloading commands:`, error);
        }
    }
}