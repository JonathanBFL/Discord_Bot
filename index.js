// Require the necessary discord.js classes
const {Client, Intents} = require('discord.js');
const {token, guildId} = require('./src/config.json');
const Interaction = require("./src/Interaction")
const CheckRoleLoop = require("./src/CheckRoleLoop")
const {roleIdHasNot} = require("./src/hasnotreadrulesrole.json");


//import moment module
const moment = require("moment");

// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.DIRECT_MESSAGES
    ],

});

// When the client is ready, run this code (only once)
client.once('ready', () => {

    //fetches the complete guild members cache - useful for getting data when bot was offline
    client.guilds.cache.get(guildId).members.fetch();

    //fetches the complete guild roles cache - useful for getting data when bot was offline
    client.guilds.cache.get(guildId).roles.fetch();

    //set bot Activity
    client.user.setActivity("V1.1 Release!");

    //set a 1 second delay before functions are called - gives time to fetch caches
    setTimeout(() => {

        //Prints time the client connected
        console.log(`\n${moment.utc(Date.now()).format('MMMM Do YYYY, h:mm:ss a')}\nLogged in as ${client.user.tag}.`);

        //Prints how many users/channels/servers the bot is monitoring
        console.log(`Monitoring ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} servers.`);

        //prints in console the bot is ready.
        console.log(`${client.user.username} is ready to spy!\n`);

        //calls function
        Interaction.Interaction(client);

        //call function
        CheckRoleLoop.CheckRoleLoop(client);

        //1 second delay
    }, 1 * 1000)

});

//todo: clean up & add message in server?
client.on('guildMemberAdd', (guildMember) => {

    console.log('User: ' + guildMember.user.username + ' has joined the server!');
    guildMember.roles.add(roleIdHasNot);


});

// Login to Discord with your client's token
client.login(token);

