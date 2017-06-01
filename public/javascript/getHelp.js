/**
 * @file getHelp.js
 * Handler for showing functions
 *
 */
 
module.exports = function getHelp(api, threadID, body) {
    var worked = true;
    var go = true;
    var command = body.substring('@help'.length);
    if (command.length==0) {
        api.sendMessage("Note: Add @ at the beginning of every command", threadID);
        api.sendMessage('Command list:\n\
cat ["gif"]\n\
color [#hex]\n\
emoji <emoji>\n\
help [command]\n\
league [summoner_name] [-setName summoner_name]\n\
stock <ticker>\n\
meme\n\
weather <zip code | city name>'
        , threadID);
        go=false;
    }
    else {
        command=command.substring(1);
    }
    if (go && command==='cat') {
        api.sendMessage('Usage of @cat:\n"@cat gif" if you want a cat gif.\nOtherwise, this command will give you a cat image.', threadID);
    }
    else if (go && command==='color') {
        api.sendMessage("Usage of @color:\nAfter the word color, type a # and then the hexadecimal value of a color\nThis command changes the chat colors to the color inputted", threadID);
        api.sendMessage("Examples:\n@color #FFFF00\n@color #a10dce", threadID);
    }
    else if (go && command==='emoji') {
        api.sendMessage("Usage of @emoji:\nSet the emoji of the thread. Append an emoji character or name after the command keyword to set emoji.", threadID);
        api.sendMessage("Examples:\n@emoji 💩\n@emoji sunglasses", threadID);
    }
    else if (go && command==='help') {
        api.sendMessage("Usage of @help:\nReplace the second instance of the word help in your most recent request, with a different command to get more information about that command", threadID);
    }
    else if (go && command==='league') {
        api.sendMessage('Usage of @league:\nLook up a League of Legends summoner\'s stats. Use "-setName" flag to set your default summoner name', threadID);
    }
    else if (go && command==='stock') {
        api.sendMessage("Usage of @stock:\nLook up a stock's stats", threadID);
    }
    else if (go && command==='meme') {
        api.sendMessage("Usage of @meme:\nUse @meme to get rickrolled wonderfully", threadID);
    }
    else if (go && command==='weather') {
        api.sendMessage("Usage of @weather:\nAfter the word weather, type either the zipcode or city, state of the place that you wish to get weather information about.\nYou will recieve current conditions as well as the 5-day forcast.", threadID);
        api.sendMessage("Examples:\n@weather New York, NY\n@weather Paris, France\n@weather 75703", threadID);
    }
    else if (go){
        api.sendMessage('Error: Unidentified command "' + command + '"', threadID);
        worked = false;
    }
    //to expand upon expansion
    if (command.length==0) {
        console.log("Help given in "+threadID);
    }
    else if (worked) {
        console.log("Help given in "+threadID+" about "+command);
    }
    else {
        console.log("Pfft... User entered help command wrong");
    }
}
