//retreives User information and send an embed message
const {clientId, guildId} = require("./config.json");
const calcDate = require("./calcDate");
const {MessageEmbed, Permissions, MessageActionRow, MessageButton} = require("discord.js");
const moment = require("moment");
const fsLibrary = require("fs");
const requireUncached = require("./requireUncached")

function Interaction(client) {

    //listens for interactions (slash commands)
    client.on('interactionCreate', async interaction => {

        const {commandName} = interaction;

        //pulls bot userID from cache
        const client_Id = client.users.cache.get(clientId);

        //Button for confirming rules are read
        if (interaction.isButton()) {

            const {roleId} = requireUncached.requireUncached('./roleconfig.json');

            //Get guilds cache
            const guild_Id = client.guilds.cache.get(guildId);

            //grabs role
            let role_Id = guild_Id.roles.cache.get(roleId);

            //grabs user id
            let user_Id = interaction.member.id;

            //grabs guild user info
            let User_GuildId = guild_Id.members.cache.get(user_Id);

            //print they reacted
            if (interaction.member.roles.cache.has(role_Id.id) || calcDate.calcDate(User_GuildId).TotalMonths > 2) {

                //finds if user is 60+ days old
                if (calcDate.calcDate(User_GuildId).TotalMonths > 2){

                    //prints confirmation
                    interaction.reply(`You've been here for over two months, you should know the rules by now <@${interaction.user.id}>!`);

                }

                //if member has new member role
                else{

                    //prints confirmation
                    interaction.reply(`Don't be silly, you already read the rules <@${interaction.user.id}>!`);

                }

                //Deletes message after 10 seconds
                setTimeout(function () {

                    interaction.deleteReply();

                }, 10 * 1000);

            }

            //print they already reacted
            else {

                //todo: cleanup
                //Adds role defined by newmember function
                interaction.member.roles.remove('892955472305487893');

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

            const {adminroleId} = requireUncached.requireUncached('./adminroleconfig.json');

            //Get guilds cache
            const guild_Id = client.guilds.cache.get(guildId);

            //grabs role
            let role_Id = guild_Id.roles.cache.get(adminroleId);

            //pulls "target" from interaction commands - guildmemberIDs
            let user_GuildId = interaction.options.getMember('target');

            //pulls "target" from interaction commands - userIDS
            let user_Id = interaction.options.getUser('target');

            //Requires designated role or admins to run command
            if (interaction.member.permissions.has('Administrator') || interaction.member.roles.cache.has(role_Id.id) ) {


                //Calls calc date function
                let user_Age = calcDate.calcDate(user_GuildId);

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

            const {adminroleId} = requireUncached.requireUncached('./adminroleconfig.json');

            //Get guilds cache
            const guild_Id = client.guilds.cache.get(guildId);

            //grabs role
            let role_Id = guild_Id.roles.cache.get(adminroleId);

            //Requires designated role or admins to run command
            if (interaction.member.permissions.has('Administrator') || interaction.member.roles.cache.has(role_Id.id)) {

                //data which will need to add in a file.
                let role_Info = interaction.options.getRole('role');

                //If the "new member" role has admin privileges, rejects it
                if (role_Info.permissions.has(Permissions.FLAGS.ADMINISTRATOR) === true){

                    //informs user
                    interaction.reply(`That role has Administrative privileges **<@${interaction.member.id}>**`);

                }

                //if the new member role _does not_ have admin privileges, write it.
                else {

                    //formats data
                    let role_Id = `{\n"roleId": "${role_Info.id}"\n}`;

                    //write data in 'roleconfig.json'.
                    fsLibrary.writeFile('./src/roleconfig.json', role_Id, (error) => {

                    })

                    //informs the user
                    interaction.reply(`New Member Role changed to **${role_Info.name}**`);

                }

            }

            //if not admin or bot command role - informs user they cant use this command
            else {

                //lets user know they dont have permissions to run command
                interaction.reply(`You do not have permissions to use that command **<@${interaction.member.id}>**.`);

            }

        }

        //looks for new member role command
        if (commandName === 'adminmemberrole') {

            const {adminroleId} = requireUncached.requireUncached('./adminroleconfig.json');

            //Get guilds cache
            const guild_Id = client.guilds.cache.get(guildId);

            //grabs role
            let role_Id = guild_Id.roles.cache.get(adminroleId);

            //Requires designated role or admins to run command
            if (interaction.member.permissions.has('Administrator') || interaction.member.roles.cache.has(role_Id.id)) {

                //data which will need to add in a file.
                let role_Info = interaction.options.getRole('role');

                //formats data
                let role_Id = `{\n"adminroleId": "${role_Info.id}"\n}`;

                //write data in 'adminroleconfig.json'.
                fsLibrary.writeFile('./src/adminroleconfig.json', role_Id, (error) => {

                })

                //informs the user
                interaction.reply(`Bot control Role changed to **${role_Info.name}**`);

            }

            //if not admin or bot command role - informs user they cant use this command
            else {

                //lets user know they dont have permissions to run command
                interaction.reply(`You do not have permissions to use that command **<@${interaction.member.id}>**.`);

            }

        }

        //looks for welcome channel commands
        if (commandName === 'welcomechannel') {

            const {adminroleId} = requireUncached.requireUncached('./adminroleconfig.json');

            //Get guilds cache
            const guild_Id = client.guilds.cache.get(guildId);

            //grabs role
            let role_Id = guild_Id.roles.cache.get(adminroleId);

            //Requires designated role or admins to run command
            if (interaction.member.permissions.has('Administrator') || interaction.member.roles.cache.has(role_Id.id)) {

                //data which will need to add in a file.
                let channel_Info = interaction.options.getChannel('channel');

                //Makes sure its actually a channel
                if (channel_Info.type === "GUILD_TEXT") {

                    //formats data
                    let channel_Id = `{\n"channelID": "${channel_Info.id}"\n}`;

                    //write data in 'channelconfig.json'.
                    fsLibrary.writeFile('./src/channelconfig.json', channel_Id, (error) => {

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

module.exports = { Interaction };