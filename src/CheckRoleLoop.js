//checks for users role - contains loop to refresh cache
const fetchloop = require("./fetchloop");
const {guildId} = require("./config.json");
const moment = require("moment");

function CheckRoleLoop(client) {

    try {

        //call functions
        loop();

        loop2();

        //Loops console logs
        function loop() {

            //Get guilds cache
            const guild_Id = client.guilds.cache.get(guildId);

            //todo: add more info - online users - etc. uptime

            //EFSC ascii
            console.log(`\t  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`);
            console.log(`\t  ┃      _________________ ______  ┃`);
            console.log(`\t  ┃     / ____/ ____/ ___// ____/  ┃`);
            console.log(`\t  ┃    / __/ / /_   \\__ \\/ /       ┃`);
            console.log(`\t  ┃   / /___/ __/  ___/ / /___     ┃`);
            console.log(`\t  ┃  /_____/_/    /____/\\____/     ┃`);
            console.log(`\t  ┃          Cyber Titans          ┃`);

            //box formatting
            console.log(`┌─────────┺━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┹────────────┐`);

            //prints to console how many members have the role and a list of the members
            console.log(`│\t      ${moment.utc(Date.now()).format('MMMM Do YYYY, h:mm:ss a')}\t\t│`);

            //box formatting
            console.log(`├───────────────────────────────────────────────────────┤`);

            //prints how many user the guild has
            console.log(`│ ${guild_Id.name} has a total of ${guild_Id.members.cache.size} users.\t│`);

            //Prints how many channels the bot is monitoring
            console.log(`│ Monitoring ${guild_Id.channels.cache.size} channels.\t\t\t\t│`);

            //box formatting
            console.log(`└───────────────────────────────────────────────────────┘`)


            let RoleMembers_map = guild_Id.roles.cache.find(r => r.id === '889284732167290880').members.map(member => member.displayName).join(` | `);


            console.log(`Users in server:\n${RoleMembers_map}\n`);


            //sets interval to 60 seconds
            setTimeout(loop, 60 * 1000);

        }

        //loops fetch script
        function loop2(){

            //call function
            fetchloop.fetchloop(client);

            //sets interval to 9 minutes
            setTimeout(loop2, 9 * 60 * 1000);
        }

    }

    catch(err) {

        console.log('!!!!! error occured in checkroleloop.js !!!!!');

    }

}

module.exports = { CheckRoleLoop }