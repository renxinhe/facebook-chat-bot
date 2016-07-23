var prompt = require("prompt");
var login = require("facebook-chat-api");

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
var handlerFunctions = {};
var handlerFunctionNames = [
	'getWeather',
	'rickroll',
	'setThreadColor',
	'getHelp',
	// TODO: add more handlers
];

for (var i = 0; i < handlerFunctionNames.length; i++) {
	// Load external functions
	handlerFunctions[handlerFunctionNames[i]] = require('./' + handlerFunctionNames[i]);
}

function messageHandler(event) {
	var message = event.body;
	if (message != null) {
		// rickroll
		if ((/^@meme$/).test(message)) {
			handlerFunctions['rickroll'](userAPI, event.threadID);
		// setThreadColor
		} else if ((/^@color \#[0-9A-Fa-f]{6}$/).test(message)) {
			handlerFunctions['setThreadColor'](userAPI, event.threadID, message);
		// getWeather
		} else if ((/^@weather ([0-9]{5}|([a-zA-Z ]+(, )?[a-zA-Z ]+))$/).test(message)) {
			handlerFunctions['getWeather'](userAPI, event.threadID, message);
		//getHelp
		} else if ((/^@help$/).test(message)) {
			handlerFunctions['getHelp'](userAPI,event.threadID,message);
		}
		// TODO: add more handlers
	}
}

// Exit -- logout user
function exitHandler(options, err) {
	stopListening();
	console.log('Stopped listening.');

	if (err) {
		return console.error(err);
	}
    if (options.cleanup || options.exit) {
    	if (email != undefined && userAPI != undefined) {
	    	console.log("Logging out \"" + email + "\"...");
	    	userAPI.logout(function(err) {
	    		console.error(err);
	    	});
	    	email = undefined;
	    	userAPI = undefined;
    	} else {
    		return console.log("No active session. Closing...")
    	}
    } else if (options.exception) {
    		return console.error(err);
    }
    return;
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exception:true}));
