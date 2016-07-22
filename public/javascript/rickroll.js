/**
 * @file rickroll.js
 * Rickrolls the user. Used for initial testing.
 *
 */

module.exports = function rickroll(api, threadID) {
	api.sendMessage("https://www.youtube.com/watch?v=dQw4w9WgXcQ", threadID);
	console.log("Rickrolled " + threadID);
}