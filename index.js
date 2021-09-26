// Require the necessary discord.js classes
const {Client, Intents, MessageEmbed} = require('discord.js');
const {token, guildId, clientId} = require('./config.json');

//import moment module
const moment = require("moment");

// import fs module in which writeFile function is defined.
const fsLibrary  = require('fs');

// Create a new client instance
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS]});

// When the client is ready, run this code (only once)
client.once('ready', () => {

    //fetches the complete cache - useful for getting data when bot was offline
    client.guilds.cache.get(guildId).members.fetch();
    client.guilds.cache.get(guildId).roles.fetch();

    //set bot Activity
    client.user.setActivity("testing");

    //set a 1 second delay before functions are called - gives time to fetch caches
    setTimeout(() => {

        //prints in console the bot is ready.
        console.log(`\nLogged in as ${client.user.tag}.`);
        console.log(`Monitoring ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} servers.`);
        console.log(`${client.user.username} is ready to spy!\n`);

        //calls functions
        Interaction();
        CheckRoleLoop();

        //1 second delay
    }, 1000)

});

//checks for users role - contains loop to refresh cache
function CheckRoleLoop() {

    //call function
    loop();

    //Loops commands
    function loop() {

        //Calls for an uncached retrieval of roleID
        const {roleID} = requireUncached('./roleconfig.json');

        //Get guilds cache
        const guild = client.guilds.cache.get(guildId);

        //grabs role
        let UserRole = guild.roles.cache.get(roleID);

        //finds each member with role "test"
        let RoleMembers = guild.members.cache.filter(member => member.roles.cache.find(role => role.id === roleID)).map(member => member.displayName).join(` | `);

        //Creates map of members with role 'test'
        let map1 = guild.members.cache.filter(member => member.roles.cache.find(role => role.id === roleID));

        //prints to console how many members have the role and a list of the members
        console.log(`${map1.size} users with role (${UserRole.name}):\n${RoleMembers}\n`)

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

                //adds roleID variable
                let UserRoleID = UserGuildID.guild.roles.cache.get(roleID);

                //if user has role run
                if (UserGuildID.roles.cache.has(roleID)) {

                    //adds role
                    UserGuildID.roles.remove(roleID);

                    //prints to console
                    console.log(`${UserGuildID.displayName} was removed from role: ${UserRoleID.name}`)

                }

                //if user does not have role
                else {

                }

            }

        }

        function requireUncached(module) {
            delete require.cache[require.resolve(module)];
            return require(module);
        }

        //sets interval to 30 seconds todo: slow down for performance
        setTimeout(loop, 1 * 1000);
    }

}

//Date calculation for users
function calcDate(UserGuildID) {

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
function Interaction() {

    //listens for interactions (slash commands)
    client.on('interactionCreate', async interaction => {

        //returns if no command
        if (!interaction.isCommand()) return;

        const {commandName} = interaction;

        //pulls bot userID from cache
        const BotUserId = client.users.cache.get(clientId)

        //fetches guild object
        const GuildName = client.guilds.cache.get(guildId);

        //looks for mention command
        if (commandName === 'userinfo') {

            //pulls "target" from interaction commands - guildmemberIDs
            let UserGuildID = interaction.options.getMember('target');

            //pulls "target" from interaction commands - userIDS
            let UserID = interaction.options.getUser('target');

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

        //looks for new member role command
        if (commandName === 'newmemberroles'){

            //data which will need to add in a file.
            let RoleInfo = interaction.options.getRole('role');
            console.log(RoleInfo);

            //formats data
            let roleid = `{\n"roleID": "${RoleInfo.id}"\n}`

            //write data in 'roleconfig.json'.
            fsLibrary.writeFile('roleconfig.json', roleid, (error) => {

            })

            //informs the user
            interaction.reply(`New Member Role changed to **${RoleInfo.name}**`);

        }

        //looks for welcome channel commands todo: create the welcome message when selected
        if (commandName === 'welcomechannel'){

            //data which will need to add in a file.
            let ChannelInfo = interaction.options.getChannel('channel');
            console.log(ChannelInfo.type);

            //Makes sure its actually a channel
            if(ChannelInfo.type === "GUILD_TEXT"){

                //formats data
                let channelID = `{\n"channelID": "${ChannelInfo.id}"\n}`

                //write data in 'channelconfig.json'.
                fsLibrary.writeFile('channelconfig.json', channelID, (error) => {

                })

                let WelcomeMessage = new MessageEmbed()
                    .setTitle(':warning: __**EFSC Discord Rules**__ :warning:')
                    .setAuthor("EFSC Bot", BotUserId.displayAvatarURL({dynamic: true})) //Displays avatar of the bot
                    .setThumbnail(BotUserId.displayAvatarURL())    //Displays avatar of mentioned user
                    .setDescription("Rules for Tech Club Discord\n" +
                        "**1**. Do not violate the EFSC Code of Conduct.\n" +
                        "**2**. __DO NOT POST NSFW CONTENT!__\n" +
                        "**3**. Do not spam chat.\n" +
                        "**4**. Treat everyone with respect.\n" +
                        "**5**. Racism and sexism will not be tolerated.\n" +
                        "**6**. Avoid political discussions.\n\n" +
                        "**Please react with :thumbsup: to confirm you have read and understand the rules**")
                    .setTimestamp()
                    .setColor('#007940')    //color of trim EFSC official color
                    .setFooter('Eastern State Florida Cyber Team', BotUserId.displayAvatarURL({dynamic: true}));    //displays bots avatar

                //sends the embed to the channel
                const message = await client.channels.cache.get(ChannelInfo.id).send({embeds: [WelcomeMessage]});
                message.react('👍');

                //finds the message id of sent message
                let id = message.id;
                console.log(id);

                //informs the user of the channel it was created in.
                interaction.reply(`Welcome message created in channel <#${ChannelInfo.id}>`);

            }

            //Informs user wrong channel was selected
            else{

                interaction.reply("Invalid - Please select a real channel!");

            }

            /*
            todo: add reactionrole function for created message
            */
        }

    });

}

// Login to Discord with your client's token
client.login(token);

