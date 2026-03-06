import { Client, IntentsBitField, Collection } from "discord.js"
import logger from "../utils/logger.ts";
import BaseModule from "../base/BaseModule.ts";
import CoreModule from "../modules/core/core.module.ts";
import BaseGuard from "../base/BaseGuard.ts";
import DevOnlyGuard from "../modules/core/guards/devOnly.guard.ts";
import CommandCooldownGuard from "../modules/core/guards/commandCooldown.guard.ts";
import BaseHandler from "../base/BaseHandler.ts";
import HandleError from "../modules/core/handler/error.handle.ts";
import HandleReloadCommands from "../modules/core/handler/reloadCommands.handler.ts";
import PokemonModule from "../modules/pokemon/pokemon.module.ts";
import TrainerModule from "../modules/trainer/trainer.module.ts";
import HasTrainerGuard from "../modules/trainer/guards/hasTrainer.guard.ts";
import HandleLearnableMoves from "../modules/pokemon/handlers/learnableMoves.handler.ts";
import HandleRandomMoves from "../modules/pokemon/handlers/randomMoves.handler.ts";
import HandleRandomNature from "../modules/pokemon/handlers/randomNature.handler.ts";
import HandleRandomIvs from "../modules/pokemon/handlers/randomIvs.handler.ts";
import HandleGrowthRate from "../modules/pokemon/handlers/growthRate.handler.ts";
import HandleCreateTrainer from "../modules/trainer/handlers/createTrainer.handler.ts";
import HandleSprites from "../modules/pokemon/handlers/sprites.handler.ts";
import HandleStats from "../modules/pokemon/handlers/stats.handler.ts";
import HandleGetRoute from "../modules/routes/handlers/getRoute.handler.ts";
import RoutesModule from "../modules/routes/routes.module.ts";

export default class DiscordClient extends Client {
    public readonly modules: Collection<string, BaseModule> = new Collection();
    public readonly guards: Collection<string, BaseGuard> = new Collection();
    public readonly handlers: Collection<string, BaseHandler> = new Collection();
    constructor() {
        super({
           intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
        });

        //#region Core Guards
        this.guards.set(DevOnlyGuard.name, new DevOnlyGuard());
        this.guards.set(CommandCooldownGuard.name, new CommandCooldownGuard());
        //#endregion

        //#region Trainer Guards
        this.guards.set(HasTrainerGuard.name, new HasTrainerGuard());
        //#endregion

        //#region Core Handlers
        this.handlers.set(HandleError.name, new HandleError());
        this.handlers.set(HandleReloadCommands.name, new HandleReloadCommands());
        //#endregion

        //#region Pokemon Handlers
        this.handlers.set(HandleGrowthRate.name, new HandleGrowthRate());
        this.handlers.set(HandleLearnableMoves.name, new HandleLearnableMoves());
        this.handlers.set(HandleRandomIvs.name, new HandleRandomIvs());
        this.handlers.set(HandleRandomMoves.name, new HandleRandomMoves());
        this.handlers.set(HandleRandomNature.name, new HandleRandomNature());
        this.handlers.set(HandleSprites.name, new HandleSprites());
        this.handlers.set(HandleStats.name, new HandleStats());
        //#endregion

        //#region Route Handlers
        this.handlers.set(HandleGetRoute.name, new HandleGetRoute());
        //#endregion

        //#region Trainer Handlers
        this.handlers.set(HandleCreateTrainer.name, new HandleCreateTrainer());
        //#endregion
    }

    private handleEvents() {
        this.modules.forEach((module) => {
            module.events.forEach((event) => {
                if (event.onlyOnce) {
                    this.once(event.name, async (...args) => await event.invoke(...args));
                } else {
                    this.on(event.name, async (...args) => await event.invoke(...args));
                }
            });
        });
    }

    public getMonitor(name: string) {
        return this.modules.find((module) => module.monitors.has(name))
            ?.monitors.get(name);
    }

    public getCommand(name: string) {
        return this.modules.find((module) => module.commands.has(name))
            ?.commands.get(name);
    }

    public async run() {
        logger.banner("Zygard Bot", `Environment: ${Deno.env.get("STATE") ?? "UNKNOWN"}`);

        this.modules.set('core', new CoreModule());
        this.modules.set('pokemon', new PokemonModule());
        this.modules.set('routes', new RoutesModule());
        this.modules.set('trainer', new TrainerModule());

        this.handleEvents();

        await this.login(Deno.env.get("DISCORD_CLIENT_TOKEN"));
    }

}