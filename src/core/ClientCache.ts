import { Collection } from "discord.js";

export default class ClientCache {
    public static readonly cooldowns: Collection<string, Collection<string, number>> = new Collection();
    constructor() {}
}