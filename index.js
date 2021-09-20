// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//shows the bot is running in console
client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return; //returns if no command

    const { commandName } = interaction; //declaring what to call

    if (commandName === 'join') { //looks for the command 'join'
        await interaction.reply(`Joined: ${interaction.member.joinedAt}`); //prints when user joined
    }
});

// Login to Discord with token
client.login(token);
