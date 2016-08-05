/**
 * @file getLeagueInfo.js
 * Handler for getting league match info.
 *
 */
'use strict'
 
var request = require('request');
var MetaInspector = require('node-metainspector');
var cheerio = require('cheerio');

var userAPI, userThreadID, endTyping, returnString;

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
            return;
        } else {
            info = info.replace(/( \/ )|(, )/g, '\n');
            returnString += info + '\n----------------\n';
            getMatchInfo(name);
        }
    });
     
    client.on("error", function(err){
        console.log(err);
    });
     
    client.fetch();
}

function getMatchInfo(name) {
    var options = {
        url: 'http://www.lolnexus.com/ajax/get-game-info/NA.json?name=' + name,
        json: true
    }
    console.log('Requesting lolnexus...');
    userAPI.sendMessage('Requesting info from LoLNexus. Please wait...', userThreadID);
    request.get(options, function(err, res, body) {
        if (err) {
            console.error('Failed to get match info.');
            console.error(err);
            return;
        }
        if ((/.+is not currently in a game.+/).test(body['html'])) {
            console.log(name + ' is not currently in a game.');
            returnString += name + ' is not currently in a game.\n';
            printResponse(returnString);
            return;
        } else if (!body['successful']) {
            console.log('Game lookup unsuccessful.');
            returnString += 'Game lookup unsuccessful for ' + name + '.\n';
            printResponse(returnString);
            return;
        }
        console.log('html loaded.');
        var html = body['html'].replace(/\r\n/g, '');
        html = body['html'].replace(/\\"/g, '"');
        html = body['html'].replace(/\r\n/g, '');

        var $ = cheerio.load(html);
        var team1 = [];
        $('tbody > tr[class$=" "]', 'div.team-1').each(function(i, element) {
            team1[i] = $(this).children('td.name').children('a').children('span').text();
            team1[i] += ' - ' + $(this).children('td.champion').children('span').children('a').text();
            if ($(this).children('td.level').text() != '') {
                team1[i] += ' - Level: ' + $(this).children('td.level').text();
            }
            team1[i] += ' - ' + $(this).children('td.current-season').children('div.ranking').children('span').first().text();
        });
        var team2 = [];
        $('tbody > tr[class$=" "]', 'div.team-2').each(function(i, element) {
            team2[i] = $(this).children('td.name').children('a').children('span').text();
            team2[i] += ' - ' + $(this).children('td.champion').children('span').children('a').text();
            if ($(this).children('td.level').text() != '') {
                team2[i] += ' - Level: ' + $(this).children('td.level').text();
            }
            team2[i] += ' - ' + $(this).children('td.current-season').children('div.ranking').children('span').first().text();
        });
        // console.log($('.team-1').children('table > tbody > tr > .name > a > span'));
        var matchInfo = 'Current Match:\n==Team 1==\n';
        for (var i = 0; i < team1.length ; i++) {
            matchInfo += team1[i] + "\n";
        }
        matchInfo += '\n==Team 2==\n';
        for (var i = 0; i < team2.length ; i++) {
            matchInfo += team2[i] + "\n";
        }
        returnString += matchInfo;
        printResponse(returnString);

        if (endTyping != undefined) {
            endTyping();
        }
        return;
    })
}

function printResponse(res) {
    userAPI.sendMessage(res, userThreadID);
}

module.exports = function getLeagueInfo(api, threadID, userID, body) {
    userAPI = api;
    userThreadID = threadID;
    returnString = '';

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
