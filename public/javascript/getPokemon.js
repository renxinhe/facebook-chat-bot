/**
 * @file getPokemon.js
 * Handler for getting the pokemon around a given location
 *
 */
var request = require('request');

function getToken(latitude, longitude) {
 	var token_get_link = 'https://pokevision.com/map/scan/' + latitude + '/' + longitude;

	request(token_get_link, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body) // Show the HTML for the Google homepage.
		}
	});
 }
