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
					var message = 'It is currently ' + data.current.temperature + '\xB0F and ' + data.current.skytext +
						' in ' + data.location.name + '.\n' +
						'It feels like ' + data.current.feelslike + '\xB0F outside. Relative humidity is ' + data.current.humidity + '%.\n' +
						'Here\'s your 5-day forecast:';

					// Concatenate forecast to message
					data.forecast.forEach(function(day) {
						message += ('\n' + day.date + ' | Low: ' + day.low + ', High: ' + day.high + '. Precipitation: ' + day.precip + '%');
					});
					api.sendMessage(message, threadID);
					console.log('Weather info sent to ' + threadID);
				}
			});
			if (end != undefined) {
				end();
			}
		} else {
			api.sendMessage('No data received.', threadID);
			console.log('No data');
		}
	});
}