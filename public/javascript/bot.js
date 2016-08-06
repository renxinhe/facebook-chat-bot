var prompt = require('prompt');
var login = require('facebook-chat-api');

// Reading user login info
if (process.env.USE_CLI === 'false') {
    email = process.env.BOT_EMAIL;
    login({email: process.env.BOT_EMAIL, password: process.env.BOT_PASSWORD}, 
        {selfListen: true, forceLogin: true}, 
        function(err, api) {
            if (err) {
                return console.error(err);
            }
            userAPI = api;
            console.log('"' + email + '" logged in!');
            // Bot listener
            stopListening = userAPI.listen(listenerCallback);
        }
    );
} else {
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

    var userAPI, email, stopListening;
    prompt.start();
    prompt.get(schema, function(err, result){
        if (err) {
            return console.error(err);
        }
        email = result.email;
        login({email: result.email, password: result.password}, 
            {selfListen: true, forceLogin: true}, 
            function(err, api) {
                if (err) {
                    return console.error(err);
                }
                userAPI = api;
                console.log('"' + email + '" logged in!');
                // Bot listener
                stopListening = userAPI.listen(listenerCallback);
            }
        );
    });
}

function listenerCallback(err, event) {
    if (err) {
        stopListening();
        return console.error(err);
    }
    switch (event.type) {
        case 'message':
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
    'getCatPicture',
    'getHelp',
    'getPokemon',
    'getStock',
    'getWeather',
    'rickroll',
    'saveLocation',
    'setEmoji',
    'setThreadColor',
    
    // TODO: add more handlers
];

for (var i = 0; i < handlerFunctionNames.length; i++) {
    // Load external functions
    handlerFunctions[handlerFunctionNames[i]] = require('./' + handlerFunctionNames[i] + '.js');
}

function messageHandler(event) {
    var message = event.body;
    if (message != undefined) {
        if ((/^@cat( gif)?$/).test(message)) {
            handlerFunctions['getCatPicture'](userAPI, event.threadID, message);
        } else if ((/^@help( .+)?$/).test(message)) {
            handlerFunctions['getHelp'](userAPI, event.threadID, message);
        } else if ((/^@pokemon( \d{1,3}){0,5}$/).test(message)) { // TODO: temporary regex
            handlerFunctions['getPokemon'](userAPI, event.threadID, event.senderID, message);
        } else if ((/^@stock .+$/).test(message)) {
            handlerFunctions['getStock'](userAPI, event.threadID, message);
        } else if ((/^@weather ([0-9]{5} [CF]|([a-zA-Z ]+(, )?[a-zA-Z ]+))$/).test(message)) {
            handlerFunctions['getWeather'](userAPI, event.threadID, message);
        } else if ((/^@meme$/).test(message)) {
            handlerFunctions['rickroll'](userAPI, event.threadID);
        } else if ((/^@emoji .+$/).test(message)) {
            handlerFunctions['setEmoji'](userAPI, event.threadID, message);
        } else if ((/^@color \#[0-9A-Fa-f]{6}$/).test(message)) {
            handlerFunctions['setThreadColor'](userAPI, event.threadID, message);
        }
    }

    for (var i = 0; i < event.attachments.length; i++) {
        var attachment = event.attachments[i];
        switch (attachment['type']) {
            case 'sticker':
            // TODO: sticker handler
            break;
            case 'file':
            // TODO: file handler
            break;
            case 'photo':
            // TODO: photo handler
            break;
            case 'animated_image':
            // TODO: animated_image handler
            break;
            case 'share':
            if ((/^https\:\/\/external\.xx\.fbcdn\.net\/static_map\.php\?/).test(attachment['image'])) {
                var COORD_PATTERN = /\-?\d{1,3}\.\d+/g;
                var coords = attachment['image'].match(COORD_PATTERN);
                if (coords.length != 2) {
                    return console.error('Bad coordinate parsing.');
                }
                handlerFunctions['saveLocation'](userAPI, event, coords[0], coords[1]);
            }
            break;
            case 'video':
            // TODO: video handler
            break;
            default:
            break;
        }
    }
}

// Exit -- logout user
function exitHandler(options, err) {
    if (typeof stopListening == 'function') {
        stopListening();
        console.log('Stopped listening.');
    }

    // if (err) {
    //     return console.error(err);
    // }
    if (options.cleanup || options.exit) {
        if (email != undefined && userAPI != undefined) {
            console.log('Logging out "' + email + '"...');
            userAPI.logout(function(err) {
                console.error(err);
            });
            email = undefined;
            userAPI = undefined;
        } else {
            return console.log('No active session. Closing...')
        }
    }
    return;
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
