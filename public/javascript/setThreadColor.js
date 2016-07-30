/**
 * @file setThreadColor.js
 * Handler for setting a thread's color.
 *
 */

module.exports = function setThreadColor(api, threadID, body) {
    var colorHex = body.substring('@color '.length).toUpperCase();
    api.changeThreadColor(colorHex, threadID, function(err){
        if (err) {
            api.sendMessage(err, threadID);
        }
    });

    api.sendMessage("Color changed to " + colorHex, threadID);
    console.log("Color changed to " + colorHex + " for " + threadID);
}
