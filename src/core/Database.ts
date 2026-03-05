import { Collection, Db, Document, MongoClient } from "mongodb";
import logger from "../utils/logger.ts";
import { PokemonSchema } from "../schemas/Pokemon.ts";
import { RouteSchema } from "../schemas/Route.ts";
import { TrainerSchema } from "../schemas/Trainer.ts";
import { UserSettingsSchema } from "../schemas/UserSettings.ts";
export default class Database {
    private static TrainerClient: MongoClient = new MongoClient(
        Deno.env.get("MONGODB_TRAINER_DATA_URI")!,
    );
    private static TrainerDb: Db = new Db(this.TrainerClient, "Trainers");
    public static PokemonCollection: Collection<PokemonSchema> = this.TrainerDb.collection("pokemons");
    public static TrainerCollection: Collection<TrainerSchema> = this.TrainerDb.collection("trainers");
    public static UserSettingCollection: Collection<UserSettingsSchema> = this.TrainerDb.collection("user_settings");

    private static GameClient: MongoClient = new MongoClient(
        Deno.env.get("MONGODB_GAME_DATA_URI")!,
    );
    private static GameDb: Db = new Db(this.GameClient, "Game");
    public static RouteCollection: Collection<RouteSchema> = this.GameDb.collection("routes");

    public static async connectAllDatabases() {
        await this.connectTrainerDatabase();
        await this.connectGameDatabase();

        return { TrainerDb: this.TrainerDb, GameDb: this.GameDb };
    }

    private static async connectTrainerDatabase() {
        try {
            await this.TrainerClient.connect();
            await this.TrainerClient.db("admin").command({ ping: 1 });
            logger.log(`[${Database.name}]`, `Successfully connected to Trainer Database.`);
            return this.TrainerDb;
        } catch (error) {
            logger.error(`[${Database.name}]`, `Error connecting to Trainer Database:`, error);
            return null;
        }
    }

    private static async connectGameDatabase() {
        try {
            await this.GameClient.connect();
            await this.GameClient.db("admin").command({ ping: 1 });
            logger.log(`[${Database.name}]`, `Successfully connected to Game Database.`);
            return this.GameDb;
        } catch (error) {
            logger.error(`[${Database.name}]`, `Error connecting to Game Database:`, error);
            return null;
        }
    }
}