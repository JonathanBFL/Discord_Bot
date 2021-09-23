const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
    new SlashCommandBuilder().setName('join').setDescription('Replies with user join info!'),
    new SlashCommandBuilder().setName('mention').setDescription('A test function for mentions'),
    new SlashCommandBuilder()
        .setName('test') //names the command
        .setDescription('Get the avatar URL of the selected user, or your own avatar.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('mention')
                .setDescription('Info about a user')
                .addUserOption(option => option
                    .setRequired(true)
                    .setName('target')
                    .setDescription('The user'))),//give description
]
    .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('registered application commands.');

    } catch (error) {
        console.error(error);
    }
})();
