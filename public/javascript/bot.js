var express = require('express');
var app = express();
var prompt = require("prompt");
var login = require("facebook-chat-api");
var weather = require("weather-js");

app.set('port', (process.env.PORT || 5000));
app.get('/', function(req, res) {
 	res.send('GET request to homepage');
});

// Reading user login info
if (process.env.USE_CLI === 'true') {
	var EMAIL_PATTERN = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	var schema = {
		properties: {
		  	email: {
		    	pattern: EMAIL_PATTERN,
		    	message: "Email format only. E.g.: foo@bar.com",
		    	required: true
		  	},
		 	password: {
		 		hidden: true,
		    	replace: '*',
		    	required: true
		  	}
		}
	};

	var userAPI, email, stopListening;
	prompt.start();
	prompt.get(schema, function(err, result){
		if (err) {
			return console.error(err);
		}
		email = result.email;
		login({email: result.email, password: result.password}, 
			{selfListen: true}, 
			function(err, api) {
				if (err) {
					return console.error(err);
				}
				userAPI = api;
				console.log("\"" + email + "\" logged in!");
				// Bot listener
				stopListening = userAPI.listen(listenerCallback);
			}
		);
	});
} else {
	email = process.env.BOT_EMAIL;
	login({email: process.env.BOT_EMAIL, password: process.env.BOT_PASSWORD}, 
		{selfListen: true}, 
		function(err, api) {
			if (err) {
				return console.error(err);
			}
			userAPI = api;
			console.log("\"" + email + "\" logged in!");
			// Bot listener
			stopListening = userAPI.listen(listenerCallback);
		}
	);
}

function listenerCallback(err, event) {
	if (err) {
		stopListening();
		return console.error(err);
	}
	switch (event.type) {
		case "message":
		messageHandler(event);
		break;
		// TODO: add more event types
		default:
		break;
	}
}

// Bot handlers
function messageHandler(event) {
	var message = event.body;
	if (message != null) {
		// rickroll
		if ((/^@meme$/).test(message)) {
			rickroll(userAPI, event.threadID);
		// setChatColor
		} else if ((/^@color \#[0-9A-Fa-f]{6}$/).test(message)) {
			setChatColor(userAPI, event.threadID, message);
		// getWeather
		} else if ((/^@weather ([0-9]{5}|([a-zA-Z ]+(, )?[a-zA-Z ]+))$/).test(message)) {
			getWeather(userAPI, event.threadID, message);
		}
		// TODO: add more handlers
	}
}

// Misc functions
function rickroll(api, threadID) {
	api.sendMessage("https://www.youtube.com/watch?v=dQw4w9WgXcQ", threadID);
	console.log("Rickrolled " + threadID);
}

function setChatColor(api, threadID, body) {
	var colorHex = body.substring('@color '.length).toUpperCase();
	api.changeThreadColor(colorHex, threadID, function(err){
		if (err) {
			api.sendMessage(err, threadID);
		}
	});

	api.sendMessage("Color changed to " + colorHex, threadID);
	console.log("Color changed to " + colorHex + " for " + threadID);
}

function getWeather(api, threadID, body) {
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

// Exit -- logout user
function exitHandler(options, err) {
	stopListening();
	console.log('Stopped listening.');

	if (err) {
		return console.error(err.stack);
	}
    if (options.cleanup || options.exit) {
    	if (email != undefined && userAPI != undefined) {
	    	console.log("Logging out \"" + email + "\"...");
	    	userAPI.logout(function(err) {
	    		console.error(err.stack);
	    	});
	    	email = undefined;
	    	userAPI = undefined;
    	} else {
    		return console.log("No active session. Closing...")
    	}
    } else if (options.exception) {
    		return console.error(err.stack);
    }
    return;
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exception:true}));