import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("server").setDescription("Information du serveur"),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply(
            `Le serveur à comme nom ${interaction.guild?.name} et il contient ${interaction.guild?.memberCount} membres`
        )
    }
}