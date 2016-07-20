var prompt = require("prompt");
var login = require("facebook-chat-api");

// Reading user login info
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

var userAPI, email;
prompt.start();
prompt.get(schema, function(err, result){
	if(err) {
		return console.error(err);
	}
	email = result.email;
	login({email: result.email, password: result.password}, function(err, api) {
		if(err) {
			return console.error(err);
		}
		userAPI = api;
		console.log("\"" + email + "\" logged in!");
		// Bot listener
		userAPI.listen(listenerCallback);
	});
});

function listenerCallback(err, event) {
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
	if (message.includes("@meme")) {
		rickroll(userAPI, event.threadID);
	}
}
// TODO: add more handlers

// Misc functions
function rickroll(api, threadID) {
	api.sendMessage("https://www.youtube.com/watch?v=dQw4w9WgXcQ", threadID);
	console.log("Rickrolled " + threadID);
}

// Exit -- logout user
function exitHandler(options, err) {
	if (err) {
		return console.error(err.stack);
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
    		console.log("No active session. Closing...")
    	}
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));