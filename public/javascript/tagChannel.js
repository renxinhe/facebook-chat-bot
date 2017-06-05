/**
 * @file tagGroup.js
 * Handler for tagging different set of people in a thread.
 *
 */

'use strict'
 
var request = require('request');
var _ = require('lodash');

module.exports = function tagChannel(api, threadID) {
    api.getThreadInfo(threadID, function(err, info) {
	    if (err) {
	        console.log(err);
	    } else {
	    	var listUserIDs = info['participantIDs'];
	    	var numUser = listUserIDs.length;
	    	api.getUserInfo(listUserIDs, function(err, usersObj) {
	    		if (err) {
	        		console.log(err);
	   			} else {
	   				var mentionsStr = 'Tagging everyone:\n';
	   				var mentionsObjs = [];
	   				var doneStrBuilding = _.after(numUser, function() {
	   					var msg = {
	   						body: mentionsStr,
	   						mentions: mentionsObjs
	   					};
	   					api.sendMessage(msg, threadID);
	   				});
	   				_.forEach(usersObj, function(value, key) {
	   					mentionsStr += '@' + value['name'] + ' ';
	   					var mentionObj = {
	   						tag: '@' + value['name'],
	   						id: key
	   					};
	   					mentionsObjs.push(mentionObj);
	   					doneStrBuilding();
	   				})
	   			}
	    	});
	    }
	});
}
