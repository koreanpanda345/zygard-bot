import DiscordClient from "./src/core/DiscordClient.ts";

export const discordClient = new DiscordClient();

await discordClient.run();