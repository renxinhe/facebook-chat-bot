/**
 * @file getCatPicture.js
 * Handler for getting cat pics.
 *
 */
'use strict'
 
var request = require('request');
var fs = require('fs');

module.exports = function getCatPicture(api, threadID, body) {
    var endTyping;
    endTyping = api.sendTypingIndicator(threadID, function (err) {
        if (err) {
            return console.error(err);
        }
                
        request
            .get('http://thecatapi.com/api/images/get?type=png&api-key=MTA3MDQz')
            .pipe(fs.createWriteStream('temp.png'))
            .on('close', function(response) {
                var picture = {
                    attachment: fs.createReadStream('temp.png')
                };
                api.sendMessage(picture, threadID);
                console.log('Cat picture sent to thread "' + threadID + '".');
                if (endTyping != undefined) {
                    endTyping();
                }
            });
    });
}
