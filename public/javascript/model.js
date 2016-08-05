/**
 * @file model.js
 * definition of db models.
 *
 */
 
var mongoose = require('mongoose');
require('./db.js');

var locationSchema = new mongoose.Schema({
    timestamp: Date,
    userID: {type: String, unique: true},
    latitude: Number,
    longitude: Number
});

exports.Location = mongoose.model('Location', locationSchema);

var summonerSchema = new mongoose.Schema({
    userID: {type: String, unique: true},
    summonerName: String
});

exports.Summoner = mongoose.model('Summoner', summonerSchema);
