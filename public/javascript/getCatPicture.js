/**
 * @file getCatPicture.js
 * Handler for getting cat pics.
 *
 */
'use strict'
 
var request = require('request');
var fs = require('fs');

var type = 'png';

module.exports = function getCatPicture(api, threadID, body) {
    if (body == '@cat gif') {
        type = 'gif';
    }
    var link;
    var API_KEY = process.env.CAT_API_KEY;
    if (API_KEY != undefined) {
        API_KEY = '&api-key=' + API_KEY;
    }
    switch (type) {
        case 'gif':
        link = 'http://thecatapi.com/api/images/get?type=gif' + API_KEY;
        break;

        default:
        link = 'http://thecatapi.com/api/images/get?type=png' + API_KEY;
    }

    var endTyping;
    endTyping = api.sendTypingIndicator(threadID, function (err) {
        if (err) {
            return console.error(err);
        }
                
        request
            .get(link)
            .pipe(fs.createWriteStream('temp.' + type))
            .on('close', function(response) {
                var picture = {
                    attachment: fs.createReadStream('temp.' + type)
                };
                api.sendMessage(picture, threadID);
                console.log('Cat picture sent to thread "' + threadID + '".');
                if (endTyping != undefined) {
                    endTyping();
                }
            });
    });
}
