// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const moment = require("moment");

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {

    //prints in console the bot is ready.
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {

    //returns if no command
    if (!interaction.isCommand()) return;

        //declaring what to call
        const { commandName } = interaction;

        //message created timestamp - unix timecode
        const createdtimestamp = (interaction.createdTimestamp);

        //author join-date timestamp - unix timecode
        const joinedtimestamp = (interaction.member.joinedTimestamp);

        //total time user has been in server - unix timecode
        const totaltimestamp = createdtimestamp - joinedtimestamp;

        //convert unix timecode into hours. /1000 to convert to seconds. /60 converts to minutes. /60 converts to hours.
        const totaltimeshour = (createdtimestamp - joinedtimestamp) / 1000 / 60 / 60;

        // /24 converts hours to days
        const totaltimeday = totaltimeshour / 24;

    //looks for the command 'join'
    if (commandName === 'join') {

        //prints with user joined info
        await interaction.reply(`Joined: ${moment.utc(interaction.member.joinedAt).fromNow()}\ncreated timestamp: ${createdtimestamp}\njoined timestamp: ${joinedtimestamp}\nTotal timestamp: ${totaltimestamp}\ntime in hours: ${totaltimeshour}\nTotal time in days: ${totaltimeday}`);
    }
});


// Login to Discord with your client's token
client.login(token);











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
