/**
 * @file getPokemon.js
 * Handler for getting the pokemon around a given location
 *
 */
 
var request = require('request');
var userAPI, userThreadID, endTyping;
const POST_TOKEN_DELAY_MS = 3000;

function getToken(latitude, longitude) {
    var tokenRequest = {
        url: 'https://pokevision.com/map/scan/' + latitude + '/' + longitude,
        json: true
    };

    request(tokenRequest, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            if (body.status == 'success') {
                console.log('Token request success!');
                setTimeout(function() {getPokemonList(latitude, longitude, body.jobId);}, POST_TOKEN_DELAY_MS);
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
                userAPI.sendMessage('Pokemon API error. Please try another time.', userThreadID);
                console.error('Pokemon JSON request status: ' + body.status);
                return console.error(body);
            }
        } else {
            return console.error(err);
        }
    });
}

function parsePokemonList(pokemon) {
    var pokemonLocationDict = {};
    for (var i = 0; i < pokemon.length; i++) {
        var newPokemon = {};
        newPokemon['pokemonId'] = pokemon[i].pokemonId;
        newPokemon['latitude'] = pokemon[i].latitude;
        newPokemon['longitude'] = pokemon[i].longitude;
        newPokemon['expiration_time'] = pokemon[i].expiration_time;

        var locationKey = pokemon[i].latitude + ',' + pokemon[i].longitude;
        if (pokemonLocationDict[locationKey] == null) {
            pokemonLocationDict[locationKey] = newPokemon;
        } else if (pokemonLocationDict[locationKey].expiration_time < newPokemon.expiration_time) {
            pokemonLocationDict[locationKey] = newPokemon;
        }
    }
    console.log('Finished scanning for Pokemon.');
    // userAPI.sendMessage(JSON.stringify(pokemonLocationDict), userThreadID); // TODO: return the number of pokemon for now

    var pokemonIDDict = {};
    for (var loc in pokemonLocationDict) {
        if (pokemonLocationDict.hasOwnProperty(loc)) {
            var Id = pokemonLocationDict[loc].pokemonId;
            if (pokemonIDDict[Id] == null) {
                pokemonIDDict[Id] = [];
            }
            pokemonIDDict[Id].push(pokemonLocationDict[loc]);
        }
    }
    pokemonIDDict = sortOnKeys(pokemonIDDict);
    
    var pokemonListString = 'Pokemon near by:\n';
    for (var id in pokemonIDDict) {
        if (pokemonIDDict.hasOwnProperty(id)) {
            pokemonListString += '#' + id + ' ' + pokemonNameDict[id] + ':\t\t\t' + pokemonIDDict[id].length + ' found\n';
        }
    }
    userAPI.sendMessage(pokemonListString, userThreadID);
    if (endTyping != null) {
        endTyping();
    }
}

function sortOnKeys(dict) {
    var sorted = [];
    for(var key in dict) {
        if (dict.hasOwnProperty(key)) {
            sorted[sorted.length] = key;
        }
    }
    sorted.sort();

    var tempDict = {};
    for(var i = 0; i < sorted.length; i++) {
        tempDict[sorted[i]] = dict[sorted[i]];
    }

    return tempDict;
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
            endTyping = api.sendTypingIndicator(threadID, function (err) {
                if (err) {
                    return console.error(err);
                }
                getToken(latitude, longitude);
            });
            return;
        }
    });

};

var pokemonNameDict = {1: 'bulbasaur', 2: 'ivysaur', 3: 'venusaur', 4: 'charmander', 5: 'charmeleon', 6: 'charizard', 7: 'squirtle', 8: 'wartortle', 9: 'blastoise', 10: 'caterpie', 11: 'metapod', 12: 'butterfree', 13: 'weedle', 14: 'kakuna', 15: 'beedrill', 16: 'pidgey', 17: 'pidgeotto', 18: 'pidgeot', 19: 'rattata', 20: 'raticate', 21: 'spearow', 22: 'fearow', 23: 'ekans', 24: 'arbok', 25: 'pikach', 26: 'raich', 27: 'sandshrew', 28: 'sandslash', 29: 'nidoran-f', 30: 'nidorina', 31: 'nidoqueen', 32: 'nidoran-m', 33: 'nidorino', 34: 'nidoking', 35: 'clefairy', 36: 'clefable', 37: 'vulpix', 38: 'ninetales', 39: 'jigglypuff', 40: 'wigglytuff', 41: 'zubat', 42: 'golbat', 43: 'oddish', 44: 'gloom', 45: 'vileplume', 46: 'paras', 47: 'parasect', 48: 'venonat', 49: 'venomoth', 50: 'diglett', 51: 'dugtrio', 52: 'meowth', 53: 'persian', 54: 'psyduck', 55: 'golduck', 56: 'mankey', 57: 'primeape', 58: 'growlithe', 59: 'arcanine', 60: 'poliwag', 61: 'poliwhirl', 62: 'poliwrath', 63: 'abra', 64: 'kadabra', 65: 'alakazam', 66: 'machop', 67: 'machoke', 68: 'machamp', 69: 'bellsprout', 70: 'weepinbell', 71: 'victreebel', 72: 'tentacool', 73: 'tentacruel', 74: 'geodude', 75: 'graveler', 76: 'golem', 77: 'ponyta', 78: 'rapidash', 79: 'slowpoke', 80: 'slowbro', 81: 'magnemite', 82: 'magneton', 83: 'farfetchd', 84: 'doduo', 85: 'dodrio', 86: 'seel', 87: 'dewgong', 88: 'grimer', 89: 'muk', 90: 'shellder', 91: 'cloyster', 92: 'gastly', 93: 'haunter', 94: 'gengar', 95: 'onix', 96: 'drowzee', 97: 'hypno', 98: 'krabby', 99: 'kingler', 100: 'voltorb', 101: 'electrode', 102: 'exeggcute', 103: 'exeggutor', 104: 'cubone', 105: 'marowak', 106: 'hitmonlee', 107: 'hitmonchan', 108: 'lickitung', 109: 'koffing', 110: 'weezing', 111: 'rhyhorn', 112: 'rhydon', 113: 'chansey', 114: 'tangela', 115: 'kangaskhan', 116: 'horsea', 117: 'seadra', 118: 'goldeen', 119: 'seaking', 120: 'stary', 121: 'starmie', 122: 'mr-mime', 123: 'scyther', 124: 'jynx', 125: 'electabuzz', 126: 'magmar', 127: 'pinsir', 128: 'tauros', 129: 'magikarp', 130: 'gyarados', 131: 'lapras', 132: 'ditto', 133: 'eevee', 134: 'vaporeon', 135: 'jolteon', 136: 'flareon', 137: 'porygon', 138: 'omanyte', 139: 'omastar', 140: 'kabuto', 141: 'kabutops', 142: 'aerodactyl', 143: 'snorlax', 144: 'articuno', 145: 'zapdos', 146: 'moltres', 147: 'dratini', 148: 'dragonair', 149: 'dragonite', 150: 'mewtwo', 151: 'mew'};
