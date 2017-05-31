var prompt = require('prompt');
const fs = require("fs");
const login = require("facebook-chat-api");

var EMAIL_PATTERN = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
var schema = {
    properties: {
          email: {
            pattern: EMAIL_PATTERN,
            message: 'Email format only. E.g.: foo@bar.com',
            required: true
          },
         password: {
            hidden: true,
            replace: '*',
            required: true
          }
    }
};

prompt.start();
prompt.get(schema, function(err, result){
    if (err) {
        return console.error(err);
    }

    login({email: result.email, password: result.password}, 
        {selfListen: true, forceLogin: true}, 
        function(err, api) {
            if (err) {
                return console.error(err);
            }

            console.log('"' + result.email + '" logged in from CLI!');
            fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
            console.log('App state has been written to appstate.json.');
        }
    );
});

