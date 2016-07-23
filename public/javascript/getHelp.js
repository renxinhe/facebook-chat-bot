/**
 * @file getHelp.js
 * Handler for showing functions
 *
 */
 
 module.exports = function getHelp(api, threadID, body) {
        var worked = 1;
        var command = body.substring('@help'.length);
        if(command.length==0) {
                api.sendMessage("Note: Add @ at the beginning of every command", threadID);
                api.sendMessage("Command list:\nhelp [command]\nweather [zip code]\nweather [city, state]\ncolor [#hex]\nmeme", threadID);
        }
        else if(command===' color') {
                api.sendMessage("Usage of color:\nAfter the word color, type a # and then the hexadecimal value of a color\nThis command changes the chat colors to the color inputted", threadID);
                api.sendMessage("Examples:\ncolor #FFFF00\ncolor #a10dce", threadID);
                api.sendMessage("Note: Add @ at the beginning of every command", threadID);
        }
        else if(command===' help') {
                api.sendMessage("Usage of help:\nReplace the second instance of the word help in your most recent request, with a different command to get more information about that command", threadID);
                api.sendMessage("Note: Add @ at the beginning of every command", threadID);
        }
        else if(command===' meme') {
                api.sendMessage("Usage of meme:\nUse meme to get rickrolled wonderfully", threadID);
                api.sendMessage("Note: Add @ at the beginning of every command", threadID);
        }
        else if(command===' weather') {
                api.sendMessage("Usage of weather:\nAfter the word weather, type either the zipcode or city, state of the place that you wish to get weather information about.\nYou will recieve current conditions as well as the 5-day forcast.", threadID);
                api.sendMessage("Examples:\nweather New York, NY\nweather Paris, France\nweather 75703", threadID);
                api.sendMessage("Note: Add @ at the beginning of every command", threadID);
        }
        else {
                api.sendMessage("Error: Unidentified command", threadID);
                worked = 0;
        }
        //to expand upon expansion
        if(command.length==0) {
                console.log("Help given in "+threadID);
        }
        else if(worked == 1) {
                console.log("Help given in "+threadID+" about "+command);
        }
        else {
                console.long("Pfft... User entered help command wrong");
        }
}
