// Require the necessary discord.js classes
const {Client, Intents} = require('discord.js');
const {token} = require('./config.json');
const moment = require("moment");

// Create a new client instance
const client = new Client({intents: [Intents.FLAGS.GUILDS]});

// When the client is ready, run this code (only once)
client.once('ready', () => {

    //prints in console the bot is ready.
    console.log('Ready!');

});

//Function for how long members have been active
function TimeConv(user) {



            //message created timestamp - unix timecode
            const createdtimestamp = (user.createdTimestamp);

            //author join-date timestamp - unix timecode
            const joinedtimestamp = (user.member.joinedTimestamp);

            //formatted time when user joined
            const joinedformated = moment.utc(user.member.joinedAt);

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
                user.channel.send(`Joined: ${joinedformated}\nMember for ${totaltimeyear} years ${adjustedmonths} months ${adjusteddays} days ${adjustedhours} hours`);
            }

            //looks for length of time if 1month+
            else if (totaltimemonth > 0) {
                user.channel.send(`Joined: ${joinedformated}\nMember for ${totaltimemonth} months ${adjusteddays} days ${adjustedhours} hours`)
            }

            //looks for length of time if 1day+
            else if (totaltimeday > 0) {
                user.channel.send(`Joined: ${joinedformated}\nMember for ${totaltimeday} days ${adjustedhours} hours`);
            }

            //looks for length of time if 1hour+
            else if (totaltimehour > 0) {
                user.channel.send(`Joined: ${joinedformated}\nMember for ${totaltimehour} hours`);
            } else {
                user.channel.send(`Joined: ${joinedformated}`);
            }



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

            //pulls "target" from interaction commands
            const user = interaction.options.getUser('target');


            TimeConv(user);



        }

    });

}

//calls TimeConv function
//TimeConv(user);
MentionUser();
test();

// Login to Discord with your client's token
client.login(token);

