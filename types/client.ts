import { Client, Collection } from "discord.js";
import { Command } from "./command.js";

export interface ClientWithCommands extends Client {
    commands: Collection<string, Command>;
    cooldowns: Collection<string, Collection<string, number>>;
}