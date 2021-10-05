//Date calculation for users
function calcDate(UserGuildID) {
    try {

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

    catch(err) {
        console.log('!!!!! error occured in calcdate.js !!!!!')
    }


}

module.exports = { calcDate };