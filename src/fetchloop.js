//loops fetch cache and 60 day role removal - slower than loop() for performance
const {guildId} = require("./config.json");
const requireUncached = require("./requireUncached");
const calcDate = require("./calcDate");
const moment = require('moment-timezone')

function fetchloop(client) {

    try {

        //fetches the complete cache - needed to grab users that are offline/haven't spoken in 10min/ etc
        client.guilds.cache.get(guildId).members.fetch();

        //fetches the complete cache - needed to grab users that are offline/haven't spoken in 10min/ etc
        client.guilds.cache.get(guildId).roles.fetch();

        //Calls for an uncached retrieval of roleID
        const {roleId} = requireUncached.requireUncached('./roleconfig.json');

        //Get guilds cache
        const guild_Id = client.guilds.cache.get(guildId);

        //Creates map of members with role
        let role_map = guild_Id.members.cache.filter(member => member.roles.cache.find(role => role.id === roleId));

        //defines the iterator
        const iterator1 = role_map.keys();

        //set bot Activity
        client.user.setActivity("V1.1 Released!");

        //for loop the size of the map
        for (let i = 0; i < role_map.size; i++) {

            //User ID - iterates through the map
            let user_Id = iterator1.next().value;

            //Get Guild ID of User ID
            let User_GuildId = guild_Id.members.cache.get(user_Id);

            //checks if user is older than 60 days by calling calcdate()
            if (calcDate.calcDate(User_GuildId).TotalMonths > 2) {

                //adds roleID variable
                let User_RoleId = User_GuildId.guild.roles.cache.get(roleId);

                //if user has role run
                if (User_GuildId.roles.cache.has(roleId)) {

                    //adds role
                    User_GuildId.roles.remove(roleId);

                    //prints to console
                    console.log(`${moment.tz('America/New_York').format('MMMM Do YYYY, h:mm:ss a')}\n${User_GuildId.displayName} was removed from role: ${User_RoleId.name}\n`);

                }

                //if user does not have role
                else {

                }

            }

        }

    }

    catch(err) {

        console.log('!!!!! error occured in fetchloop.js !!!!!');

    }
}


module.exports = { fetchloop }