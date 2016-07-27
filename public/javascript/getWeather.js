/**
 * @file getWeather.js
 * Handler for getting weather information.
 *
 */
var weather = require("weather-js");

module.exports = function getWeather(api, threadID, body) {
	var locale = body.substring('@weather '.length);
	console.log('Fetching weather for ' + locale + '...');
	weather.find({ search: locale, degreeType: 'F' }, function(err, result) {
		if (err) {
			api.sendMessage(err, threadID);
			console.error(err);
		} else if (result) {
			// Display typing indicator during async fetch and processing
			var end = api.sendTypingIndicator(threadID, function(err) {
				if (err) {
					console.log(err);
				} else {
					var data = result[0];
					var skycode = parseInt(data.current.skycode, 10);
					var emoji;

					// Switch for emoji (emojis and grouping subject to change)

					// Thunderstorms
					if ([0, 1, 2, 3, 4, 17, 35, 37, 38, 47].indexOf(skycode) > -1) { 
						emoji = ' \u26C8 '; // thunder cloud and rain
				 	// Icy
					} else if ([8, 9].indexOf(skycode) > -1) { 
						emoji = ' \u2744 '; // snowflake (U+2744)
					// Rain
					} else if ([11, 12].indexOf(skycode) > -1) {
						emoji = ' \uD83C\uDF27 '; // cloud with rain (U+1F327)
					// Showers
					} else if ([39, 45].indexOf(skycode) > -1) {
						emoji = ' \u2614 '; // umbrella with rain drops (U+2614)
					// Snow
					} else if ([13, 14, 16, 42, 43].indexOf(skycode) > -1) {
						emoji = ' \uD83C\uDF28 '; // cloud with snow (U+1F328)
					// Cloudy
					} else if ([26, 27, 29, 33, 28, 30, 34].indexOf(skycode) > -1) {
						emoji = ' \u2601 '; // cloud (U+2601)
					// Dust, fog, haze, smoke
					} else if ([19, 20, 21, 22].indexOf(skycode) > -1) {
						emoji = ' \uD83C\uDF01 '; // foggy (U+1F301)
					// Windy
					} else if ([23, 24].indexOf(skycode) > -1) {
						emoji = ' \uD83C\uDF2C '; // wind blowing face (U+1F32C)
					// Blizzard
					} else if (skycode === 15) {
						emoji = ' \u2603 '; // snowman (U+2603)
					// Clear (night)
					} else if (skycode === 31) {
						emoji = ' \uD83C\uDF1A '; // new moon with face (U+1F31A)
					// Clear
					} else if (skycode === 32) {
						emoji = ' \uD83C\uDF1E '; // sun with face (U+1F31E)
					// Hot
					} else if (skycode === 36) {
						emoji = ' \uD83D\uDD25 '; // fire (U+1F525)
					} else {
						emoji = '';
					}

					var message = 'It is currently ' + data.current.temperature + '\xB0F and ' + data.current.skytext + emoji +
						' in ' + data.location.name + '.\n' +
						'It feels like ' + data.current.feelslike + '\xB0F outside. Relative humidity is ' + data.current.humidity + '%.\n' +
						'Here\'s your 5-day forecast:';

					// Concatenate forecast to message
					data.forecast.forEach(function(day, index) {
						message += ('\n' + day.date + ' | Low: ' + day.low + ', High: ' + day.high + '.');
						if (index !== 1) {
							message += ' Precipitation: ' + day.precip + '%';
						}
					});
					api.sendMessage(message, threadID);
					console.log('Weather info sent to ' + threadID);
				}
			});
			if (end != null) {
				end();
			}
		} else {
			api.sendMessage('No data received.', threadID);
			console.log('No data');
		}
	});
}