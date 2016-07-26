/**
 * @file saveLocation.js
 * Handler for saving a user's location.
 *
 */

module.exports = function saveLocation(api, timestamp, userID, latitude, longitude) {
	latitude = parseFloat(latitude);
	longitude = parseFloat(longitude);

	console.log('lat: ' + latitude + ' lon: ' + longitude);
}