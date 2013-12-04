;
var __ = require("underscore");
var async = require("async");
var crypto = require("crypto");
var MongoClient = require("mongodb").MongoClient;
exports.runGame = function(req, res) {
    var rapperName = req.body.artist;
    var fourLines = [];
    var fourSongNames = [];
    MongoClient.connect("mongodb://localhost:27017/rapGeniusData", function(err, db) {
        if(err) throw err;
        var collection = db.collection("songs");
        var collection2 = db.collection("answers");
        var correctAnswer = "";
        var query = {artist: rapperName};
        collection.count({artist: rapperName}, function(err, count) {
            async.series([
                function(seriesCallback) { getLyrics(count, collection, query, fourLines, correctAnswer, fourSongNames, db, seriesCallback); },
                function(seriesCallback) { getRandomSongNames(count, collection, query, fourSongNames, db, seriesCallback); },
                function(seriesCallback) { getRandomSongNames(count, collection, query, fourSongNames, db, seriesCallback); },
                function(seriesCallback) { getRandomSongNames(count, collection, query, fourSongNames, db, seriesCallback); }
            ],
            function(err,results) {
                if(err) throw err;
                saveAnswer(fourLines, fourSongNames, results[0], collection2, db, res);
                console.log(results);
            });
        });
    });
};

//  Get lyrics and one song name
var getLyrics = function(count, collection, query, fourLines, correctAnswer, fourSongNames, db, seriesCallback) {
    var options = {skip: Math.floor((Math.random()*(count-1))), limit: 1};
    collection.find(query, options).toArray(function(err, docs) {
        if(err) seriesCallback(err, null);
        var max = docs[0].lyrics.length - 4;
        var min = 0;
        var firstLineIndex = Math.floor(Math.random() * (max - min + 1) + min);
        for (var i = 0; i < 4; i++) {
            fourLines.push(docs[0].lyrics[firstLineIndex+i]);
        }
        correctAnswer = docs[0].name;
        fourSongNames.push(correctAnswer);
        db.close;
        seriesCallback(null, correctAnswer);
    });
};

// Get random song names from the artist to populate question
var getRandomSongNames = function(count, collection, query, fourSongNames, db, seriesCallback) {
    var options = {skip: Math.floor((Math.random()*(count-1))), limit: 1}; // fn 2
    collection.find(query, options).toArray(function(err, docs) {
        if(err) seriesCallback(err, null);
        fourSongNames.push(docs[0].name);
        db.close;
        seriesCallback(null, docs[0].name);
    });
};

// Save answer to DB and render page with question
var saveAnswer = function(fourLines, fourSongNames, correctAnswer, collection2, db, res) {
    var hex = crypto.createHash('sha1').update(fourLines.join()).digest('hex');
    var possibleAnswers = __.shuffle(fourSongNames);
    var correctIndex = __.indexOf(possibleAnswers, correctAnswer);
    var answer = {sha1: hex, answer: correctIndex};
    collection2.insert(answer, function(err, docs) {
        if(err) seriesCallback(err, null);
        db.close;
        res.render("game", {fourLines: fourLines, songNames: possibleAnswers, sha1: hex});
    });
};
