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

//Function for how long members have been active
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

//Function to detect mentioned users
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

//Time to put mentions and time together
function test() {
    //console command to verify function was called
    console.log("test function running");

    client.on('interactionCreate', interaction => {

        //returns if no command
        if (!interaction.isCommand()) return;

        const {commandName} = interaction;

        //looks for mention command
        if (commandName === 'test') {

            //pulls "target" from interaction commands - guildmemberIDs
            const user = interaction.options.getMember('target');

            //pulls "target" from interaction commands - userIDS
            const user2 = interaction.options.getUser('target');

            //pulls bot userID from cache
            const dev = client.users.cache.get(clientId)

            //message created timestamp - unix timecode
            const createdtimestamp = (interaction.createdTimestamp);

            //author join-date timestamp - unix timecode
            const joinedtimestamp = (user.joinedTimestamp);

            //formatted time when user joined
            const joinedformated = moment.utc(user.joinedAt).format('LLL');

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
            embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Discord Member Join Information')
                .setAuthor("EFSC Bot", dev.displayAvatarURL({dynamic: true}))
                .setThumbnail(user2.displayAvatarURL())
                .setTimestamp()
                .setColor('#007940')
                .addFields(
                    {name: 'Nickname', value: interaction.options.getMember('target').displayName, inline: true},
                    {name: 'Username', value: interaction.options.getUser('target').tag, inline: true},
                    {name: '\u200b', value: '\u200b'},
                    {name: 'Joined Our Discord', value: moment.utc(user.joinedAt).format('LLL'), inline: true},
                    {
                        name: 'Joined Discord',
                        value: moment(interaction.options.getUser('target').createdAt, "YYYYMMDD").fromNow(),
                        inline: true
                    },
                    {name: '\u200b', value: '\u200b'},
                    {
                        name: 'Membership Length',
                        value: `Member for **${totaltimeyear}** years **${adjustedmonths}** months **${adjusteddays}** days **${adjustedhours}** hours`
                    }
                )
                .setFooter('Eastern State Florida Cyber Team', dev.displayAvatarURL({dynamic: true}));


            //calls to print embed
            interaction.reply({embeds: [embed]});

        }

    });

}

//calls TimeConv function
TimeConv();
MentionUser();
test();

// Login to Discord with your client's token
client.login(token);

