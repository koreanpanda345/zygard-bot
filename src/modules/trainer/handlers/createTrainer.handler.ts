import { ObjectId } from "mongodb";
import BaseHandler from "../../../base/BaseHandler.ts";
import Database from "../../../core/Database.ts";

export default class HandleCreateTrainer extends BaseHandler {
  constructor() {
    super(HandleCreateTrainer.name);
  }

  override async handle(userId: string, pokemonId: ObjectId) {
    const check = await Database.TrainerCollection.findOne({
      discordUserId: userId,
    });

    if (check) return check;

    return await Database.TrainerCollection.insertOne({
      discordUserId: userId,
      team: [pokemonId],
      inventory: [],
      money: 200,
      route: "savanna",
      allowedRoutes: ["savanna"],
      quests: [
        {
          questid: "savanna_quest_1",
          progress: [0, 1],
          completed: false,
        },
      ],
    });
  }
}
