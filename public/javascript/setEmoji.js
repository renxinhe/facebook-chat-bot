/**
 * @file setEmoji.js
 * Handler for setting a thread's emoji.
 *
 */

var nodeEmoji = require("node-emoji");

module.exports = function setEmoji(api, threadID, body) {
    var emojiStr = body.substring('@emoji '.length);
    var result;
    if (nodeEmoji.which(emojiStr) != null) {
        result = emojiStr;
    } else {
        var emoji = nodeEmoji.get(emojiStr);
        // node-emoji.get returns the same string but with colons
        // around it in the error case.
        if (emoji === ':' + emojiStr + ':') {
            api.sendMessage("Could not find emoji '" + emojiStr + "'", threadID);
            console.log("Could not find emoji '" + emojiStr + "' for thread " + threadID);
            return
        }
        result = emoji;
    }
    api.changeThreadEmoji(result, threadID, function(err) {
        var resultMessage = err == null ? "Set emoji to " + result : "Failed to set emoji to " + result;
        api.sendMessage(resultMessage, threadID);
        console.log(resultMessage + " for thread " + threadID);
    });
}
