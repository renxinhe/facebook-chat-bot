/**
 * @file saveLocation.js
 * Handler for saving a user's location.
 *
 */

module.exports = function saveLocation(api, time, ID, lat, lon) {
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
        }
    });
}
