import { discordClient } from "../../../../main.ts";
import BaseHandler from "../../../base/BaseHandler.ts";
import HandleLearnableMoves from "./learnableMoves.handler.ts";

export default class HandleRandomMoves extends BaseHandler {
    constructor() {
        super(HandleRandomMoves.name);
    }

    override async handle(name: string, level: number) {
        const learnableMoves = await discordClient.handlers.get(HandleLearnableMoves.name)?.handle(name, level) as string[];
        
        let movepool: string[] = learnableMoves;

        movepool = this.shouldAlwaysHave(name, level, movepool);
        return movepool.reverse().slice(0, 4);
    }

    shouldAlwaysHave(species: string, level: number, movepool: string[]) {
        // TODO: Need to implement a scheme for the database so I don't have to restart the bot.

        switch (species) {}

        return movepool;
    }
}