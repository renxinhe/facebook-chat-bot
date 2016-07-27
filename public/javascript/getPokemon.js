/**
 * @file getPokemon.js
 * Handler for getting the pokemon around a given location
 *
 */
 
var request = require('request');
var userAPI, userThreadID;

function getToken(latitude, longitude) {
    var tokenRequest = {
        url: 'https://pokevision.com/map/scan/' + latitude + '/' + longitude,
        json: true
    };

    request(tokenRequest, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            if (body.status == 'success') {
                console.log('Token request success!');
                setTimeout(function() {getPokemonList(latitude, longitude, body.jobId);}, 3000);
                return;
            } else {
                console.error('Token request status: ' + body.status);
                return console.error(body);
            }
        }
    });
 }

function getPokemonList(latitude, longitude, token) {
    var pokemonRequest = {
        url: 'https://pokevision.com/map/data/' + latitude + '/' + longitude +'/' + token,
        json: true
    };
    console.log(pokemonRequest.url);
    request(pokemonRequest, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            if (body.status == 'success') {
                if (body.jobStatus == 'in_progress') {
                    userAPI.sendMessage('Pokemon API busy. Please try another time.', userThreadID);
                    return;
                }
                console.log('Pokemon JSON request success!');
                parsePokemonList(body.pokemon);
                return;
            } else {
                console.error('Pokemon JSON request status: ' + body.status);
                return console.error(body);
            }
        } else {
            return console.error(err);
        }
    });
}

function parsePokemonList(pokemon) {
    var pokemonDict = {};
    for (var i = 0; i < pokemon.length; i++) {
        var newPokemon = {};
        newPokemon['pokemonId'] = pokemon[i].pokemonId;
        newPokemon['latitude'] = pokemon[i].latitude;
        newPokemon['longitude'] = pokemon[i].longitude;
        newPokemon['expiration_time'] = pokemon[i].expiration_time;

        var locationKey = pokemon[i].latitude + ',' + pokemon[i].longitude;
        if (pokemonDict[locationKey] == null) {
            pokemonDict[locationKey] = newPokemon;
        } else if (pokemonDict[locationKey].expiration_time < newPokemon.expiration_time) {
            pokemonDict[locationKey] = newPokemon;
        }
    }
    console.log('Finished scanning for Pokemon.');
    userAPI.sendMessage(JSON.stringify(pokemonDict), userThreadID); // TODO: return the number of pokemon for now
}

module.exports = function getPokemon(api, threadID, userID, body) {
    userAPI = api;
    userThreadID = threadID;

    var latitude, longitude;
    var Location = require('./model.js').Location;
    Location.where({userID: String(userID)}).findOne(function(err, location) {
        if (err) {
            return console.error(err);
        }
        if (location == null) {
            api.sendMessage('Location data not found. Please first specify a location via messenger location sharing.', threadID);
            return console.log('User "' + userID + '" location info not found in database.');
        } else {
            latitude = location['latitude'];
            longitude = location['longitude'];
            getToken(latitude, longitude);
            return;
        }
    });

};