import { discordClient } from "../../../../main.ts";
import BaseEvent from "../../../base/BaseEvent.ts";
import Database from "../../../core/Database.ts";
import logger from "../../../utils/logger.ts";
import HandleReloadCommands from "../handler/reloadCommands.handler.ts";

export default class ClientReadyEvent extends BaseEvent {
    constructor() {
        super("clientReady", true);
    }

    public override async invoke() {
        const rows: (string | number)[][] = [
            ...discordClient.modules.map(m  => [m.constructor.name,  "Module"]),
            ...discordClient.handlers.map(h => [h.constructor.name, "Handler"]),
            ...discordClient.guards.map(g   => [g.constructor.name,  "Guard"]),
        ];
        logger.table(["Name", "Type"], rows);

        await discordClient.handlers.get(HandleReloadCommands.name)?.handle();
        await Database.connectAllDatabases();
        logger.info(`[${ClientReadyEvent.name}]`, `Client is ready!`);
    }
}