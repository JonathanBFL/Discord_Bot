// Require the necessary discord.js classes
const {Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const {token, guildId, clientId} = require('./config.json');

//import moment module
const moment = require("moment");

// import fs module in which writeFile function is defined.
const fsLibrary  = require('fs');

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
    }, 1 * 1000)

});

//checks for users role - contains loop to refresh cache
function CheckRoleLoop() {

    //call function
    loop();

    //Loops commands
    function loop() {

        //Calls for an uncached retrieval of roleID
        const {roleId} = requireUncached('./roleconfig.json');

        //Get guilds cache
        const guild_Id = client.guilds.cache.get(guildId);

        //grabs role
        let role_Id = guild_Id.roles.cache.get(roleId);

        //finds each member with role "test"
        let RoleMembers_map = guild_Id.members.cache.filter(member => member.roles.cache.find(role => role.id === roleId)).map(member => member.displayName).join(` | `);

        //Creates map of members with role
        let role_map = guild_Id.members.cache.filter(member => member.roles.cache.find(role => role.id === roleId));

        //prints to console how many members have the role and a list of the members
        console.log(`${role_map.size} users with role (${role_Id.name}):\n${RoleMembers_map}\n`);

        //defines the iterator
        const iterator1 = role_map.keys();

        //for loop the size of the map
        for (let i = 0; i < role_map.size; i++) {

            //User ID - iterates through the map
            let user_Id = iterator1.next().value;

            //Get Guild ID of User ID
            let User_GuildId = guild_Id.members.cache.get(user_Id);

            //checks if user is older than 60 days by calling calcdate()
            if (calcDate(User_GuildId).GuildDays > 60) {

                //adds roleID variable
                let User_RoleId = User_GuildId.guild.roles.cache.get(roleId);

                //if user has role run
                if (User_GuildId.roles.cache.has(roleId)) {

                    //adds role
                    User_GuildId.roles.remove(roleId);

                    //prints to console
                    console.log(`${User_GuildId.displayName} was removed from role: ${User_RoleId.name}`);

                }

                //if user does not have role
                else {

                }

            }

        }

        //sets interval to 30 seconds todo: slow down for performance
        setTimeout(loop, 3 * 1000);

    }

}

//function to delete caches
function requireUncached(module) {

    delete require.cache[require.resolve(module)];

    return require(module);

}

//Date calculation for users
function calcDate(UserGuildID) {

    //Gets current time
    const TimestampNow = (Date.now());

    //author join-date timestamp - unix timecode
    const TimestampJoinedGuild = (UserGuildID.joinedTimestamp);

    //convert unix timecode into hours.
    // /1000 to convert to seconds. /60 converts to minutes. /60 converts to hours. rounds down.
    const TotalHours = Math.floor((TimestampNow - TimestampJoinedGuild) / 1000 / 60 / 60);

    // /24 converts hours to days - rounds down.
    const TotalDays = Math.floor(TotalHours / 24);

    // Subtract total number days off total number of hours
    //prevents out of bounds var if days/weeks/months/years are used
    const GuildHours = TotalHours - (TotalDays * 24);

    //Months uses 30 days as a month todo: fix month usage
    const TotalMonths = Math.floor(TotalDays / 30);

    //takes total days subtracted by (num. of months * 30)
    //prevents out of bounds var if weeks/months/years are used
    const GuildDays = TotalDays - (TotalMonths * 30);

    //takes total days divided by 365 to get years
    const TotalYears = Math.floor(TotalDays / 365);

    //prevents out of bounds var if years are used
    const GuildMonths = TotalMonths - (TotalYears * 12);

    //returns variables
    return {
        TimestampNow,
        TimestampJoinedGuild,
        TotalHours,
        TotalDays,
        GuildHours,
        TotalMonths,
        GuildDays,
        TotalYears,
        GuildMonths,
    };

}

//retreives User information and send an embed message
function Interaction() {

    //listens for interactions (slash commands)
    client.on('interactionCreate', async interaction => {

        const {commandName} = interaction;

        //pulls bot userID from cache
        const client_Id = client.users.cache.get(clientId);

        //Button for confirming rules are read
        if (interaction.isButton()) {

            const {roleId} = requireUncached('./roleconfig.json');

            //Get guilds cache
            const guild_Id = client.guilds.cache.get(guildId);

            //grabs role
            let role_Id = guild_Id.roles.cache.get(roleId);

            //print they reacted
            if (interaction.member.roles.cache.has(role_Id.id)) {

                //prints confirmation

                interaction.reply(`Don't be silly, you already read the rules <@${interaction.user.id}>!`);

                //Deletes message after 10 seconds
                setTimeout(function () {

                    interaction.deleteReply();

                }, 10 * 1000);

            }

            //print they already reacted
            else {

                //Adds role defined by newmember function
                interaction.member.roles.add(role_Id);

                //prints confirmation
                interaction.reply(`Thank you for reading the rules <@${interaction.user.id}>!`);

                //Deletes message after 10 seconds
                setTimeout(function () {

                    interaction.deleteReply();

                }, 10 * 1000);

            }

        }

        //looks for mention command
        if (commandName === 'userinfo') {

            const {adminroleId} = requireUncached('./adminroleconfig.json');

            //Get guilds cache
            const guild_Id = client.guilds.cache.get(guildId);

            //grabs role
            let role_Id = guild_Id.roles.cache.get(adminroleId);

            //pulls "target" from interaction commands - guildmemberIDs
            let user_GuildId = interaction.options.getMember('target');

            //pulls "target" from interaction commands - userIDS
            let user_Id = interaction.options.getUser('target');

            //Requires designated role or admins to run command
            if (interaction.member.roles.cache.has(role_Id.id) || interaction.member.permissions.has('Administrator')) {

                //Calls calc date function
                let user_Age = calcDate(user_GuildId);

                //creating embed format
                let MemberInfo = new MessageEmbed()
                    .setTitle('Discord Member Join Information')
                    .setAuthor("EFSC Bot", client_Id.displayAvatarURL({dynamic: true})) //Displays avatar of the bot
                    .setThumbnail(user_Id.displayAvatarURL())    //Displays avatar of mentioned user
                    .setTimestamp()
                    .setColor('#007940')    //color of trim EFSC official color
                    .addFields(
                        {
                            //displays the current username in the server of mentioned user
                            name: 'Nickname',
                            value: user_GuildId.displayName,
                            inline: true
                        },

                        {
                            //displays the unedited username of mentioned user
                            name: 'Username',
                            value: user_Id.tag,
                            inline: true
                        },

                        {
                            //spacer
                            name: '\u200b',
                            value: '\u200b'
                        },

                        {
                            //date mentioned user joined the server
                            name: `Joined **${guild_Id}**`,
                            value: moment.utc(user_GuildId.joinedAt).format('LLL'),
                            inline: true
                        },

                        {

                            //todo: fix \u200b quick-fix and display if no roles.
                            //displays the current roles of the mentioned user
                            name: 'Roles:',
                            value: `${user_GuildId.roles.cache.filter(r => r.name !== '@everyone').map(role => role.name).join(` **|** `)} \u200b`,
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
                            value: `Member for **${user_Age.TotalYears}** years **${user_Age.GuildMonths}** months **${user_Age.GuildDays}** days **${user_Age.GuildHours}** hours`
                        }
                    )
                    .setFooter('Eastern State Florida Cyber Team', client_Id.displayAvatarURL({dynamic: true}));    //displays bots avatar

                //calls to print embed
                interaction.reply({embeds: [MemberInfo]});
            }

            else {

                //lets user know they dont have permissions to run command
                interaction.reply(`You do not have permissions to use that command **<@${interaction.member.id}>**.`);

            }

        }

        //looks for new member role command
        if (commandName === 'newmemberroles') {

            const {adminroleId} = requireUncached('./adminroleconfig.json');

            //Get guilds cache
            const guild_Id = client.guilds.cache.get(guildId);

            //grabs role
            let role_Id = guild_Id.roles.cache.get(adminroleId);

            //Requires designated role or admins to run command
            if (interaction.member.roles.cache.has(role_Id.id) || interaction.member.permissions.has('Administrator')) {

                //data which will need to add in a file.
                let role_Info = interaction.options.getRole('role');

                //formats data
                let role_Id = `{\n"roleId": "${role_Info.id}"\n}`;

                //write data in 'roleconfig.json'.
                fsLibrary.writeFile('roleconfig.json', role_Id, (error) => {

                })

                //informs the user
                interaction.reply(`New Member Role changed to **${role_Info.name}**`);

            }

            else {

                //lets user know they dont have permissions to run command
                interaction.reply(`You do not have permissions to use that command **<@${interaction.member.id}>**.`);

            }

        }

        //looks for new member role command
        if (commandName === 'adminmemberrole') {

            const {adminroleId} = requireUncached('./adminroleconfig.json');

            //Get guilds cache
            const guild_Id = client.guilds.cache.get(guildId);

            //grabs role
            let role_Id = guild_Id.roles.cache.get(adminroleId);

            //Requires designated role or admins to run command
            if (interaction.member.roles.cache.has(role_Id.id) || interaction.member.permissions.has('Administrator')) {

                //data which will need to add in a file.
                let role_Info = interaction.options.getRole('role');

                //formats data
                let role_Id = `{\n"adminroleId": "${role_Info.id}"\n}`;

                //write data in 'adminroleconfig.json'.
                fsLibrary.writeFile('adminroleconfig.json', role_Id, (error) => {

                })

                //informs the user
                interaction.reply(`Bot control Role changed to **${role_Info.name}**`);

            }

            else {

                //lets user know they dont have permissions to run command
                interaction.reply(`You do not have permissions to use that command **<@${interaction.member.id}>**.`);

            }

        }

        //looks for welcome channel commands
        if (commandName === 'welcomechannel') {

            const {adminroleId} = requireUncached('./adminroleconfig.json');

            //Get guilds cache
            const guild_Id = client.guilds.cache.get(guildId);

            //grabs role
            let role_Id = guild_Id.roles.cache.get(adminroleId);

            //Requires designated role or admins to run command
            if (interaction.member.roles.cache.has(role_Id.id) || interaction.member.permissions.has('Administrator')) {

                //data which will need to add in a file.
                let channel_Info = interaction.options.getChannel('channel');

                //Makes sure its actually a channel
                if (channel_Info.type === "GUILD_TEXT") {

                    //formats data
                    let channel_Id = `{\n"channelID": "${channel_Info.id}"\n}`;

                    //write data in 'channelconfig.json'.
                    fsLibrary.writeFile('channelconfig.json', channel_Id, (error) => {

                    })

                    //create button style
                    const button = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setStyle("DANGER")
                                .setCustomId('RuleButton')
                                .setLabel('I have read the rules')
                                .setEmoji('🧾'),
                        );

                    //create embed style
                    let WelcomeMessage_Embed = new MessageEmbed()
                        .setTitle(':warning: __**EFSC Discord Rules**__ :warning:')
                        .setAuthor("EFSC Bot", client_Id.displayAvatarURL({dynamic: true})) //Displays avatar of the bot
                        .setThumbnail("https://www.easternflorida.edu/news-events/branding/images/efsclogo-initials.png")    //Displays avatar of mentioned user
                        .setDescription("**Rules**\n" +
                            "**1**. Do not violate the EFSC Code of Conduct.\n" +
                            "**2**. __DO NOT POST NSFW CONTENT!__\n" +
                            "**3**. Do not spam chat.\n" +
                            "**4**. Treat everyone with respect.\n" +
                            "**5**. Racism and sexism will not be tolerated.\n" +
                            "**6**. Avoid political discussions.")
                        .setTimestamp()
                        .setColor('#007940')    //color of trim EFSC official color
                        .setFooter('Eastern State Florida Cyber Team', client_Id.displayAvatarURL({dynamic: true}));    //displays bots avatar

                    //sends the embed to the channel
                    await client.channels.cache.get(channel_Info.id).send({
                        embeds: [WelcomeMessage_Embed],
                        components: [button]
                    });


                    //informs the user of the channel it was created in.
                    interaction.reply(`Welcome message created in channel <#${channel_Info.id}>`);

                }

                //Informs user wrong channel was selected
                else if (channel_Info.type !== "GUILD_TEXT") {

                    //informs user of invalid input
                    interaction.reply(`**${channel_Info.name}** is a Category! - Please select a channel <@${interaction.user.id}>!`);

                    //Deletes message after 10 seconds
                    setTimeout(function () {

                        interaction.deleteReply();

                    }, 10 * 1000);

                } else {

                    //lets user know they dont have permissions to run command
                    interaction.reply(`You do not have permissions to use that command **<@${interaction.member.id}>**.`);

                }
            }

        }

    });

}

// Login to Discord with your client's token
client.login(token);

