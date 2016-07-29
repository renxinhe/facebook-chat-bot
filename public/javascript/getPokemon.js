/**
 * @file getPokemon.js
 * Handler for getting the pokemon around a given location
 *
 */
 
var request = require('request');
const fs = require('fs');
var userAPI, userThreadID, endTyping, latitude, longitude;
const POST_TOKEN_DELAY_MS = 3000;
const MAX_JSON_RETRY_COUNT = 3;

// Flags
var showList = false;
var mapPokemonID = [];

function getToken() {
    var tokenRequest = {
        url: 'https://pokevision.com/map/scan/' + latitude + '/' + longitude,
        json: true
    };

    request(tokenRequest, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            if (body.status == 'success') {
                console.log('Token request success!');
                setTimeout(function() {getPokemonList(body.jobId, MAX_RETRY_COUNT);}, POST_TOKEN_DELAY_MS);
                return;
            } else {
                userAPI.sendMessage('Cannot retreive API token. Please check www.pokevision.com for Pokemon Trainer Club status.', userThreadID);
                console.error('Token request status: ' + body.status);
                return console.error(body);
            }
        }
    });
 }

function getPokemonList(token, callCounter) {
    if (callCounter <= 0) {
        userAPI.sendMessage('Pokemon API busy. Please try another time.', userThreadID);
        return;
    }
    callCounter -= 1;

    var pokemonRequest = {
        url: 'https://pokevision.com/map/data/' + latitude + '/' + longitude +'/' + token,
        json: true
    };
    request(pokemonRequest, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            if (body.status == 'success') {
                if (body.jobStatus == 'in_progress') {
                    userAPI.sendMessage('Pokemon scanning in progress. Will retry ' + callCounter + ' more times.', userThreadID);
                    setTimeout(function() {getPokemonList(body.jobId, callCounter);}, POST_TOKEN_DELAY_MS);
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
    
    var pokemonListString = 'Pokemon nearby:\n';
    for (var id in pokemonIDDict) {
        if (pokemonIDDict.hasOwnProperty(id)) {
            pokemonListString += '#' + id + ' ' + 
                                String(pokemonNameDict[id] + ':                    ').slice(0, 20) + 
                                pokemonIDDict[id].length + ' found\n';
        }
    }
    if (showList) {
        userAPI.sendMessage(pokemonListString, userThreadID);
    } else {
        // Constructing static map URL
        var mapURL = 'https://maps.googleapis.com/maps/api/staticmap?';
        mapURL += 'center=' + latitude + ',' + longitude + '&';
        mapURL += 'size=640x640&';
        mapURL += 'scale=2&';
        mapURL += 'markers=' + latitude + ',' + longitude + '&';
        for (var i = 0; i < mapPokemonID.length; i++) {
            mapURL += 'markers=icon:http://pkmn.net/sprites/frlg/' + mapPokemonID[i] + '.png%7C';
            var pokemonListByID = pokemonIDDict[mapPokemonID[i]];
            if (pokemonListByID == undefined) {
                continue;
            }
            for (var j = 0; j < pokemonListByID.length; j++) {
                mapURL += pokemonListByID[j].latitude + ',' + pokemonListByID[j].longitude + '%7C';
            }
            mapURL += '&';
        }

        console.log(mapURL);
        request
            .get(mapURL)
            .pipe(fs.createWriteStream('temp_pokemon.png'))
            .on('close', function(response) {
                var map = {
                    // body: "Fuck Javascript!",
                    attachment: fs.createReadStream('temp_pokemon.png')
                };
                userAPI.sendMessage(map, userThreadID);
            });
    }
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

function parseBody(body) {
    if (body == '@pokemon') {
        showList = true;
        mapPokemonID = [];
    } else {
        body = body.substring('@pokemon '.length);
        showList = false;
        mapPokemonID = body.split(' ');
    }
}

module.exports = function getPokemon(api, threadID, userID, body) {
    userAPI = api;
    userThreadID = threadID;
    parseBody(body);

    var Location = require('./model.js').Location;
    Location.where({userID: String(userID)}).findOne(function(err, location) {
        if (err) {
            return console.error(err);
        }
        if (location == null) {
            api.sendMessage('User location data not found. Please first send a location via Messenger location sharing.', threadID);
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

var pokemonNameDict = {1: 'Bulbasaur', 2: 'Ivysaur', 3: 'Venusaur', 4: 'Charmander', 5: 'Charmeleon', 6: 'Charizard', 7: 'Squirtle', 8: 'Wartortle', 9: 'Blastoise', 10: 'Caterpie', 11: 'Metapod', 12: 'Butterfree', 13: 'Weedle', 14: 'Kakuna', 15: 'Beedrill', 16: 'Pidgey', 17: 'Pidgeotto', 18: 'Pidgeot', 19: 'Rattata', 20: 'Raticate', 21: 'Spearow', 22: 'Fearow', 23: 'Ekans', 24: 'Arbok', 25: 'Pikachu', 26: 'Raichu', 27: 'Sandshrew', 28: 'Sandslash', 29: 'Nidoran♀', 30: 'Nidorina', 31: 'Nidoqueen', 32: 'Nidoran♂', 33: 'Nidorino', 34: 'Nidoking', 35: 'Clefairy', 36: 'Clefable', 37: 'Vulpix', 38: 'Ninetales', 39: 'Jigglypuff', 40: 'Wigglytuff', 41: 'Zubat', 42: 'Golbat', 43: 'Oddish', 44: 'Gloom', 45: 'Vileplume', 46: 'Paras', 47: 'Parasect', 48: 'Venonat', 49: 'Venomoth', 50: 'Diglett', 51: 'Dugtrio', 52: 'Meowth', 53: 'Persian', 54: 'Psyduck', 55: 'Golduck', 56: 'Mankey', 57: 'Primeape', 58: 'Growlithe', 59: 'Arcanine', 60: 'Poliwag', 61: 'Poliwhirl', 62: 'Poliwrath', 63: 'Abra', 64: 'Kadabra', 65: 'Alakazam', 66: 'Machop', 67: 'Machoke', 68: 'Machamp', 69: 'Bellsprout', 70: 'Weepinbell', 71: 'Victreebel', 72: 'Tentacool', 73: 'Tentacruel', 74: 'Geodude', 75: 'Graveler', 76: 'Golem', 77: 'Ponyta', 78: 'Rapidash', 79: 'Slowpoke', 80: 'Slowbro', 81: 'Magnemite', 82: 'Magneton', 83: 'Farfetchd', 84: 'Doduo', 85: 'Dodrio', 86: 'Seel', 87: 'Dewgong', 88: 'Grimer', 89: 'Muk', 90: 'Shellder', 91: 'Cloyster', 92: 'Gastly', 93: 'Haunter', 94: 'Gengar', 95: 'Onix', 96: 'Drowzee', 97: 'Hypno', 98: 'Krabby', 99: 'Kingler', 100: 'Voltorb', 101: 'Electrode', 102: 'Exeggcute', 103: 'Exeggutor', 104: 'Cubone', 105: 'Marowak', 106: 'Hitmonlee', 107: 'Hitmonchan', 108: 'Lickitung', 109: 'Koffing', 110: 'Weezing', 111: 'Rhyhorn', 112: 'Rhydon', 113: 'Chansey', 114: 'Tangela', 115: 'Kangaskhan', 116: 'Horsea', 117: 'Seadra', 118: 'Goldeen', 119: 'Seaking', 120: 'Staryu', 121: 'Starmie', 122: 'Mr-Mime', 123: 'Scyther', 124: 'Jynx', 125: 'Electabuzz', 126: 'Magmar', 127: 'Pinsir', 128: 'Tauros', 129: 'Magikarp', 130: 'Gyarados', 131: 'Lapras', 132: 'Ditto', 133: 'Eevee', 134: 'Vaporeon', 135: 'Jolteon', 136: 'Flareon', 137: 'Porygon', 138: 'Omanyte', 139: 'Omastar', 140: 'Kabuto', 141: 'Kabutops', 142: 'Aerodactyl', 143: 'Snorlax', 144: 'Articuno', 145: 'Zapdos', 146: 'Moltres', 147: 'Dratini', 148: 'Dragonair', 149: 'Dragonite', 150: 'Mewtwo', 151: 'Mew'};
