;
var __ = require("underscore");
var async = require("async");
var MongoClient = require("mongodb").MongoClient;
var crypto = require("crypto");

exports.runGame = function(req, res) {
    var rapperName = req.body.artist;
    MongoClient.connect("mongodb://localhost:27017/rapGeniusData", function(err, db) {
        if(err) throw err;
        var songs = db.collection("songs");
        var query = {artist: rapperName};
        songs.find({artist: rapperName}, {name: 1, lyrics: 1, _id: 0}).toArray(function(err, docs) {
            getFourRandomSongTitles(docs, getFourRandomLines, db, res);
        });
    });
};

// get four song names
var getFourRandomSongTitles = function(docs, getFourRandomLines, db, res) {
    var arr = []; // will contain four random indexes representing four songs
    while(arr.length < 4){ // populate arr
        var randomnumber = Math.ceil(Math.random()*(docs.length-1))
        var found = false;
        for(var i = 0; i<arr.length; i++){
            if (arr [i] == randomnumber) {found = true;break}
        }
        if(!found)arr[arr.length]=randomnumber;
    }
    var songNames = __.map(arr, function(songIndex) {return docs[songIndex].name});
    getFourRandomLines(docs, db, songNames, arr, res);
};

// get four lines from a song
var getFourRandomLines = function(docs, db, songNames, arr, res) {
    var fourLines = []; // lyrics to give to lines
    var correctIndex = Math.floor(Math.random() * (4)); // correctAnswer. Between 0 and 3
    var max = docs[arr[correctIndex]].lyrics.length - 4;
    var firstLineIndex = Math.floor(Math.random() * (max + 1));
    var lineIndexes = [firstLineIndex, firstLineIndex+1, firstLineIndex+2, firstLineIndex+3];
    var fourLines = __.map(lineIndexes, function(lineIndex) {return docs[arr[correctIndex]].lyrics[lineIndex]});
    saveAnswer(fourLines, songNames, correctIndex, db, res);
};

// Save answer to DB and render page with question
var saveAnswer = function(fourLines, songNames, correctIndex, db, res) {
    var hex = crypto.createHash('sha1').update(fourLines.join()).digest('hex');
    var answer = {sha1: hex, answer: correctIndex};
    var answers = db.collection("answers");        
    answers.insert(answer, function(err, docs) {
        if(err) seriesCallback(err, null);
        db.close();
        res.render("game", {fourLines: fourLines, songNames: songNames, sha1: hex});
    });
};
