/**
 * @file getLeagueInfo.js
 * Handler for getting league match info.
 *
 */
'use strict'
 
var request = require('request');
var MetaInspector = require('node-metainspector');

var userAPI, userThreadID, endTyping;

function setName(userID, name) {
    var Summoner = require('./model.js').Summoner;
    var newSummoner = {
        userID: String(userID),
        summonerName: name
    };

    var IDQuery = {userID: String(userID)};
    Summoner.findOneAndUpdate(IDQuery, newSummoner, {upsert: true, new: true}, function(err, summoner) {
        if (err) {
            return console.error(err);
        } else {
            return summoner;
        }
    });
}

function getSummonerInfo(name) {
    var client = new MetaInspector("http://na.op.gg/summoner/userName=" + name, { timeout: 5000 });
    client.on("fetch", function(){
        var info = client.description;
        if (info == 'LoL Stats! Check your Summoner, MMR, Live Spectate and using powerful global League of Legends Statistics!') {
            userAPI.sendMessage('Summoner "' + name + '" not found.', userThreadID);
        } else {
            info = info.replace(/( \/ )|(, )/g, '\n');
            userAPI.sendMessage(info, userThreadID);
        }

        if (endTyping != undefined) {
            endTyping();
        }
        return;
    });
     
    client.on("error", function(err){
        console.log(err);
    });
     
    client.fetch();
}

module.exports = function getLeagueInfo(api, threadID, userID, body) {
    userAPI = api;
    userThreadID = threadID;

    if (body == '@league') {
        var Summoner = require('./model.js').Summoner;
        Summoner.where({userID: String(userID)}).findOne(function(err, summoner) {
            if (err) {
                return console.error(err);
            }
            if (summoner == null) {
                api.sendMessage('User summoner data not found.\nPlease set default summoner name with\n"@league -setName <summoner_name>".', threadID);
                return console.log('User "' + userID + '" summoner info not found in database.');
            } else {
                var name = summoner['summonerName'];
                endTyping = api.sendTypingIndicator(threadID, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    getSummonerInfo(name);
                });
            }
        });
        return;
    } else {
        body = body.substring('@league '.length);  
    }

    if ((/^-setName .+$/).test(body)) {
        let name = body.substring('-setName '.length);

        setName(userID, name);
        // TODO: add db update failure check
        console.log('Summoner name for user "' + userID + '" updated!');
        api.sendMessage('Summoner name for user ID "' + userID + '"" updated!', threadID);
        return;
    } else {
        endTyping = api.sendTypingIndicator(threadID, function (err) {
            if (err) {
                return console.error(err);
            }
            getSummonerInfo(body);
        });
        return;
    }
}
