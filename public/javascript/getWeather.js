/**
 * @file getWeather.js
 * Handler for getting weather information.
 *
 */
"use strict"
 
var weather = require("weather-js");

function printWeather(api, threadID, searchTerm) {
    console.log('Fetching weather for ' + searchTerm + '...');
    weather.find({ search: searchTerm, degreeType: 'F' }, function(err, result) {
        if (err) {
            api.sendMessage(err, threadID);
            console.error(err);
        } else if (result) {
            // Display typing indicator during async fetch and processing
            const end = api.sendTypingIndicator(threadID, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    const data = result[0];
                    const skycode = parseInt(data.current.skycode, 10);
                    let emoji;

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

                    let message = 
                        data.current.temperature + '\xB0F\n' + data.location.name + '\n' + data.current.skytext + emoji + '\n' +
                        'Feels like ' + data.current.feelslike + '\xB0. Humidity ' + data.current.humidity + '%.\n';

                    // Concatenate forecast to message
                    data.forecast.forEach(function(day) {
                        const dateArray = day.date.split('-');
                        const date = dateArray[1] + '-' + dateArray[2];
                        message += ('\n' + date + ' | ' + day.low + '\xB0/' + day.high + '\xB0');
                        if (day.precip.length > 0) {
                            message += '  \u2614 ' + day.precip + '%';
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

module.exports = function getWeather(api, threadID, userID, body) {
    if (body === '@weather') {
        let Location = require('./model.js').Location;
        Location.where({userID: String(userID)}).findOne(function(err, location) {
            if (err) {
                return console.error(err);
            }
            if (location == null) {
                api.sendMessage('User location data not found. Please send a location via Messenger location sharing or specify a location with @weather LOCATION', threadID);
                return console.log('User "' + userID + '" location info not found in database;');
            }
            console.log(location);
            let latitude = location.latitude;
            let longitude = location.longitude;
            printWeather(api, threadID, latitude+','+longitude);
        });
    } else {
        printWeather(api, threadID, body.substring('@weather '.length));
    }
}
