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


        //convert unix timecode into hours.
        // /1000 to convert to seconds. /60 converts to minutes. /60 converts to hours. rounds down.
        const totaltimeshour = Math.floor((createdtimestamp - joinedtimestamp) / 1000 / 60 / 60);

        // /24 converts hours to days - rounds down.
        const totaltimeday = Math.floor(totaltimeshour / 24);

        // Subtract total number days off total number of hours
        const adjustedhours = totaltimeshour - (totaltimeday * 24);


    //looks for the command 'join'
    if (commandName === 'join') {

        //prints with user joined info
        await interaction.reply(`Joined: ${moment.utc(interaction.member.joinedAt)}\nMember for ${totaltimeday} days ${adjustedhours} hours`);

    }
});


// Login to Discord with your client's token
client.login(token);

