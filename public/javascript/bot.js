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

var email;
prompt.start();
prompt.get(schema, function(err, result){
	if(err) {
		return console.error(err);
	}
	email = result.email;
	login({email: result.email, password: result.password}, loginCallback);
});


// Bot logic
var api;
function loginCallback(err, callbackAPI) {
	if(err) {
		return console.error(err);
	}
	api = callbackAPI;
	console.log("\"" + email + "\" logged in!");
}

// Exit -- logout user
function exitHandler(options, err) {
	if (err) {
		return console.error(err.stack);
	}
    if (options.cleanup || options.exit) {
    	if (email != undefined && api != undefined) {
	    	console.log("Logging out \"" + email + "\"...");
	    	api.logout(function(err) {
	    		return console.error(err);
	    	});
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