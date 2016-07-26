/**
 * @file saveLocation.js
 * Handler for saving a user's location.
 *
 */
var mongoose = require('mongoose');

if (process.env.MONGODB_URI == undefined) {
	return console.error('No database found.')
} else {
	mongoose.connect(process.env.MONGODB_URI);
}

var locationSchema = mongoose.Schema({
    timestamp: Date,
    userID: {type: String, unique: true},
    latitude: Number,
    longitude: Number
});

var locationModel = mongoose.model('Location', locationSchema);

module.exports = function saveLocation(api, time, ID, lat, lon) {
	var location = new Location({
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
};