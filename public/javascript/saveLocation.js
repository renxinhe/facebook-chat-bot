/**
 * @file saveLocation.js
 * Handler for saving a user's location.
 *
 */

module.exports = function saveLocation(api, time, ID, lat, lon) {
	var locationModel = require('./model.js').Location;

	var location = new locationModel({
		timestamp: Date(time),
		userID: String(ID),
		latitude: parseFloat(lat),
		longitude: parseFloat(lon)
	});

	var IDQuery = {userID: String(ID)};
	locationModel.findOneAndUpdate(IDQuery, location, {upsert: true}, function(err, location) {
		if (err) {
			console.error(err);
		} else {
			console.log(location.userID + ' updated!');
		}
	});
}