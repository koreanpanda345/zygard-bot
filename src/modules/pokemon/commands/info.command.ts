import { Dex } from "@pkmn/dex";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import BaseCommand from "../../../base/BaseCommand.ts";
import ClientCache from "../../../core/ClientCache.ts";
import { PokemonSchemaStats } from "../../../schemas/Pokemon.ts";
import logger from "../../../utils/logger.ts";
import Database from "../../../core/Database.ts";
import { discordClient } from "../../../../main.ts";
import HandleSprites from "../handlers/sprites.handler.ts";
import { filledBar } from "string-progressbar";
import HandleStats from "../handlers/stats.handler.ts";
import HandleError from "../../core/handler/error.handle.ts";


export default class InfoCommand extends BaseCommand {
  constructor() {
    super("info", "Displays information of one of your pokemon", (data) => {
      data.addNumberOption((opt) => {
        opt.setName("id").setDescription("The id of the pokemon in your pc")
          .setRequired(true);
        return opt;
      });

      return data;
    });

    this.flags = {
      hasTrainer: 1,
    }
  }

  override async invoke(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const id = interaction.options.getNumber("id", true);

    const list = await (Database.PokemonCollection.find({
      discordUserId: interaction.user.id,
    })).toArray();

    const pokemon = list[id - 1];

    if (!pokemon) {
      await interaction.editReply({
        content: `You don't have a pokemon with ID **${id}**. You currently have **${list.length}** pokemon.`,
      });
      return;
    }

    const species = Dex.species.get(pokemon.species!);

    if (!species.exists) {
      await interaction.editReply({
        content:
          `There seems to be something wrong with the pokemon you want to view. It doesn't seem to exist!?`,
      });
      return;
    }

    try {
      const embed = new EmbedBuilder();

      embed.setTitle(
        `${interaction.user.username}'s Level ${pokemon.level} ${species.name} ${
          pokemon.shiny ? "🌟" : ""
        }`,
      );

      const sprite = await discordClient.handlers.get(HandleSprites.name)?.handle(
        pokemon.species!,
        false,
        pokemon.shiny!,
      ) as string;

      embed.setImage(
        sprite,
      );
      const neededExp = pokemon.neededExp;
      const [bar, percent] = filledBar(neededExp!, pokemon.exp!);

      embed.setDescription(
        `Experience: ${bar} ${
          Math.floor(Math.round(Number(percent)))
        }%\n(${pokemon.exp}/${neededExp})\n**Type:** ${
          species.types.join(" | ")
        }\nWeight: ${species.weightkg}kg\nEgg Group(s): ${
          species.eggGroups.join(" | ")
        }`,
      );

      embed.addFields({
        name: "Ability",
        value: `${pokemon.ability}\nDescription: ${
          Dex.abilities.get(pokemon.ability!).desc
        }`,
      });

      const stats = discordClient.handlers.get(HandleStats.name)?.handle(
        species,
        pokemon,
      ) as PokemonSchemaStats;
      embed.addFields({
        name: `Base Stats`,
        value: `**HP:** ${stats.hp} (Ivs: ${pokemon.ivs.hp}/31)\n` +
          `**Atk:** ${stats.atk} (Ivs: ${pokemon.ivs.atk}/31)\n` +
          `**Def:** ${stats.def} (Ivs: ${pokemon.ivs.def}/31)\n` +
          `**SpA:** ${stats.spa} (Ivs: ${pokemon.ivs.spa}/31)\n` +
          `**SpD:** ${stats.spd} (Ivs: ${pokemon.ivs.spd}/31)\n` +
          `**Spe:** ${stats.spe} (Ivs: ${pokemon.ivs.spe}/31)`,
      });

      for (const move of pokemon.moves) {
        const moveData = Dex.moves.get(move);

        embed.addFields({
          name: `Move: ${moveData.name}`,
          value:
            `BP: ${moveData.basePower} | Type: ${moveData.type} | Accuracy: ${moveData.accuracy} | PP: ${moveData.pp}\n${moveData.desc}`,
        });
      }

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      logger.error("command - info", error);
      await discordClient.handlers.get(HandleError.name)?.handle(
        interaction,
        "An error occurred while trying to fetch the pokemon's info. Please try again later.",
      );
    }
  }
}