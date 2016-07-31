/**
 * @file saveLocation.js
 * Handler for saving a user's location.
 *
 */

module.exports = function saveLocation(api, event, lat, lon) {
    var time = event.timestamp;
    var ID = event.senderID;
    var threadID = event.threadID;
    var Location = require('./model.js').Location;

    var newLocation = {
        timestamp: Date(time),
        userID: String(ID),
        latitude: parseFloat(lat),
        longitude: parseFloat(lon)
    };

    var IDQuery = {userID: String(ID)};
    Location.findOneAndUpdate(IDQuery, newLocation, {upsert: true, new: true}, function(err, location) {
        if (err) {
            console.error(err);
        } else {
            console.log('Location for user "' + location.userID + '"" updated!');
            api.markAsRead(threadID, function(err) {
                if (err) {
                    return console.error(err);
                }
            });
        }
    });
}
