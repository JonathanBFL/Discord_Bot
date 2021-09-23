// Require the necessary discord.js classes
const {Client, Intents, MessageEmbed} = require('discord.js');
const {token, guildId, clientId} = require('./config.json');
const moment = require("moment");

// Create a new client instance
const client = new Client({intents: [Intents.FLAGS.GUILDS]});

// When the client is ready, run this code (only once)
client.once('ready', () => {

    //prints in console the bot is ready.
    console.log('Ready!');

});

/*
//Function for how long members have been active todo:remove for 1.0.4
function TimeConv() {

    //pulls "target" from interaction commands
    client.on('interactionCreate', interaction => {

        const {commandName} = interaction;

        //looks for mention command
        if (commandName === 'join') {

            //message created timestamp - unix timecode
            const createdtimestamp = (interaction.createdTimestamp);

            //author join-date timestamp - unix timecode
            const joinedtimestamp = (interaction.member.joinedTimestamp);

            //formatted time when user joined
            const joinedformated = moment.utc(interaction.member.joinedAt);

            //convert unix timecode into hours.
            // /1000 to convert to seconds. /60 converts to minutes. /60 converts to hours. rounds down.
            const totaltimehour = Math.floor((createdtimestamp - joinedtimestamp) / 1000 / 60 / 60);
            console.log(totaltimehour);

            // /24 converts hours to days - rounds down.
            const totaltimeday = Math.floor(totaltimehour / 24);
            console.log(totaltimeday);

            // Subtract total number days off total number of hours
            //prevents out of bounds var if days/weeks/months/years are used
            const adjustedhours = totaltimehour - (totaltimeday * 24);
            console.log(adjustedhours);

            //Months uses 30 days as a month todo: fix month usage
            const totaltimemonth = Math.floor(totaltimeday / 30);
            console.log(totaltimemonth);

            //takes total days subtracted by (num. of months * 30)
            //prevents out of bounds var if weeks/months/years are used
            const adjusteddays = totaltimeday - (totaltimemonth * 30);
            console.log(adjusteddays);

            //takes total days divided by 365 to get years
            const totaltimeyear = Math.floor(totaltimeday / 365);
            console.log(totaltimeyear);

            //prevents out of bounds var if years are used
            const adjustedmonths = totaltimemonth - (totaltimeyear * 12);
            console.log(adjustedmonths);

            //looks for length of time if 1year+
            if (totaltimeyear > 0) {
                interaction.channel.send(`Joined: ${joinedformated}\nMember for ${totaltimeyear} years ${adjustedmonths} months ${adjusteddays} days ${adjustedhours} hours`);
            }

            //looks for length of time if 1month+
            else if (totaltimemonth > 0) {
                interaction.channel.send(`Joined: ${joinedformated}\nMember for ${totaltimemonth} months ${adjusteddays} days ${adjustedhours} hours`)
            }

            //looks for length of time if 1day+
            else if (totaltimeday > 0) {
                interaction.channel.send(`Joined: ${joinedformated}\nMember for ${totaltimeday} days ${adjustedhours} hours`);
            }

            //looks for length of time if 1hour+
            else if (totaltimehour > 0) {
                interaction.channel.send(`Joined: ${joinedformated}\nMember for ${totaltimehour} hours`);
            } else {
                interaction.channel.send(`Joined: ${joinedformated}`);
            }
        }

    });

}
*/

/*
//Function to detect mentioned users todo:remove for 1.0.4
function MentionUser() {
    console.log("function mention");

    client.on('interactionCreate', interaction => {

        //returns if no command
        if (!interaction.isCommand()) return;

        const {commandName} = interaction;

        //looks for mention command
        if (commandName === 'mention') {

            //pulls "target" from interaction commands
            const user = interaction.options.getUser('target');

            // if  true return message
            if (user) return interaction.reply(`${user.username}'s avatar: ${user.displayAvatarURL({dynamic: true})}`);

            // if  true false message
            return interaction.reply(`Your avatar: ${interaction.user.displayAvatarURL({dynamic: true})}`);

        }

    });

}
*/

//todo: creeate function for time in use of UserInfo() and role deletion

//Time to put mentions and time together
function UserInfo() {
    //console command to verify function was called
    console.log("test function running");

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

            //message created timestamp - unix timecode
            const createdtimestamp = (interaction.createdTimestamp);

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
                        name: `Joined ${GuildName}`,
                        value: moment.utc(UserGuildID.joinedAt).format('LLL'),
                        inline: true
                    },

                    /* not needed todo:remove for 1.0.4
                    {
                        name: 'Joined Discord',
                        value: moment(UserID.createdAt, "YYYYMMDD").fromNow(),
                        inline: true
                    },
                     */

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
                        value: `Member for **${totaltimeyear}** years **${adjustedmonths}** months **${adjusteddays}** days **${adjustedhours}** hours`
                    }
                )
                .setFooter('Eastern State Florida Cyber Team', BotUserId.displayAvatarURL({dynamic: true}));    //displays bots avatar

            //calls to print embed
            interaction.reply({embeds: [MemberInfo]});

        }

    });

}

//calls TimeConv function
//TimeConv(); todo:remove for 1.0.4
//MentionUser(); todo:remove for 1.0.4
UserInfo();

// Login to Discord with your client's token
client.login(token);

