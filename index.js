// Require the necessary discord.js classes
const {Client, Intents, MessageEmbed} = require('discord.js');
const {token, guildId, clientId} = require('./config.json');
const moment = require("moment");

// Create a new client instance
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS]});

// When the client is ready, run this code (only once)
client.once('ready', () => {

    //prints in console the bot is ready.
    console.log(`I am ready! Logged in as ${client.user.tag}!`);
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.\n`);

    //calls functions
    UserInfo();


    //todo: enable for 1.0.4
    NewRole();

});

//todo: create function for time in use of UserInfo() and role deletion
//todo: enable for 1.0.4
function NewRole(){

    //console command to verify function was called
    console.log("NewRole function running\n");

    //fetches the complete cache - useful for getting data when bot was offline
    client.guilds.cache.get(guildId).members.fetch();
    client.guilds.cache.get(guildId).roles.fetch();

    //Loops commands
    setInterval(() => {

        //Get guilds cache
        const guild = client.guilds.cache.get(guildId);

        //finds each member with role "Bots" todo: change to final role
        const members = guild.members.cache.filter(member => member.roles.cache.find(role => role.name === `Bots`)).map(member => member.displayName).join(` **|** `);

        //print each member into the console.
        console.log(members + "\n");

        //set bot Activity
        client.user.setActivity("testing");

        //TESTING BELOW//

        //Creates map of members with role 'Bots'
        const map1 = guild.members.cache.filter(member => member.roles.cache.find(role => role.name === `Bots`));
        console.log(map1.size);

        //defines the iterator
        const iterator1 = map1.keys();

        //for loop the size of the map
        for (let i = 0; i < map1.size; i++) {

            //User ID - iterates through the map
            let UID = iterator1.next().value;

            //Get Guild ID of User ID
            let UserGuildID = guild.members.cache.get(UID)

            //send to function calcDate
            let days = calcDate(UserGuildID);

            //checks if user is older than 60 days
            if (days.totaltimeday > 60) {
                //todo: remove roles here
                console.log("user is 60 days old")
            }

        }

        //TESTING ABOVE//

        //sets interval to 5 seconds todo: slow down for performance
    }, 1 * 5000);

}

//Date calculation for users
function calcDate(UserGuildID){

    //Gets current time
    const createdtimestamp = (Date.now());

    //author join-date timestamp - unix timecode
    const joinedtimestamp = (UserGuildID.joinedTimestamp);

    //convert unix timecode into hours.
    // /1000 to convert to seconds. /60 converts to minutes. /60 converts to hours. rounds down.
    const totaltimehour = Math.floor((createdtimestamp - joinedtimestamp) / 1000 / 60 / 60);

    // /24 converts hours to days - rounds down.
    const totaltimeday = Math.floor(totaltimehour / 24);

    // Subtract total number days off total number of hours
    //prevents out of bounds var if days/weeks/months/years are used
    const adjustedhours = totaltimehour - (totaltimeday * 24);

    //Months uses 30 days as a month todo: fix month usage
    const totaltimemonth = Math.floor(totaltimeday / 30);

    //takes total days subtracted by (num. of months * 30)
    //prevents out of bounds var if weeks/months/years are used
    const adjusteddays = totaltimeday - (totaltimemonth * 30);

    //takes total days divided by 365 to get years
    const totaltimeyear = Math.floor(totaltimeday / 365);

    //prevents out of bounds var if years are used
    const adjustedmonths = totaltimemonth - (totaltimeyear * 12);

    //returns variables
    return {
        createdtimestamp,
        joinedtimestamp,
        totaltimehour,
        totaltimeday,
        adjustedhours,
        totaltimemonth,
        adjusteddays,
        totaltimeyear,
        adjustedmonths,
    };

}

//retreives User information and send an embed message
function UserInfo() {

    //listens for interactions (slash commands)
    client.on('interactionCreate', interaction => {

        //returns if no command
        if (!interaction.isCommand()) return;

        const {commandName} = interaction;

        //looks for mention command
        if (commandName === 'userinfo') {

            //pulls "target" from interaction commands - guildmemberIDs
            let UserGuildID = interaction.options.getMember('target');

            //pulls "target" from interaction commands - userIDS
            let UserID = interaction.options.getUser('target');

            //pulls bot userID from cache
            const BotUserId = client.users.cache.get(clientId)

            //fetches guild object
            const GuildName = client.guilds.cache.get(guildId);

            //Calls calc date function
            let jointime = calcDate(UserGuildID);

            //creating embed format
            let MemberInfo = new MessageEmbed()
                .setTitle('Discord Member Join Information')
                .setAuthor("EFSC Bot", BotUserId.displayAvatarURL({dynamic: true})) //Displays avatar of the bot
                .setThumbnail(UserID.displayAvatarURL())    //Displays avatar of mentioned user
                .setTimestamp()
                .setColor('#007940')    //color of trim EFSC official color
                .addFields(
                    {
                        //displays the current username in the server of mentioned user
                        name: 'Nickname',
                        value: UserGuildID.displayName,
                        inline: true
                    },

                    {
                        //displays the unedited username of mentioned user
                        name: 'Username',
                        value: UserID.tag,
                        inline: true
                    },

                    {
                        //spacer
                        name: '\u200b',
                        value: '\u200b'
                    },

                    {
                        //date mentioned user joined the server
                        name: `Joined **${GuildName}**`,
                        value: moment.utc(UserGuildID.joinedAt).format('LLL'),
                        inline: true
                    },

                    {
                        //displays the current roles of the mentioned user
                        name: 'Roles:',
                        value: UserGuildID.roles.cache.filter(r => r.name !== '@everyone').map(role => role.name).join(` **|** `),
                        inline: true
                    },

                    {
                        //spacer
                        name: '\u200b',
                        value: '\u200b'
                    },

                    {
                        //total time the user has been a member in the server
                        name: 'Membership Length',
                        value: `Member for **${jointime.totaltimeyear}** years **${jointime.adjustedmonths}** months **${jointime.adjusteddays}** days **${jointime.adjustedhours}** hours`
                    }
                )
                .setFooter('Eastern State Florida Cyber Team', BotUserId.displayAvatarURL({dynamic: true}));    //displays bots avatar

            //calls to print embed
            interaction.reply({embeds: [MemberInfo]});

        }

    });

}

// Login to Discord with your client's token
client.login(token);

