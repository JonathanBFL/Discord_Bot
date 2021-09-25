const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
    new SlashCommandBuilder()
        .setName('welcomechannel')    //names the command
        .setDescription('Sets the channel for welcome message')
        .addChannelOption(option => option
            .setRequired(true)  //requires mention input
            .setName('channel')  //mentioned user var
            .setDescription('The channel')),   //give description

    new SlashCommandBuilder()
        .setName('newmemberroles')
        .setDescription('Sets the role for new members')
        .addRoleOption(option => option
            .setRequired(true)  //requires mention input
            .setName('role')  //mentioned user var
            .setDescription('The role')),   //give description

    new SlashCommandBuilder()
        .setName('userinfo')    //names the command
        .setDescription('Get the information of a member.')
        .addUserOption(option => option
            .setRequired(true)  //requires mention input
            .setName('target')  //mentioned user var
            .setDescription('The user')),   //give description
]
    .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

//when ran it updates the "slash" commands on the bot
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
