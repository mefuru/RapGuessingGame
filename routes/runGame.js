var __ = require("underscore");
var async = require("async");
var MongoClient = require("mongodb").MongoClient;
var crypto = require("crypto");

exports.runGame = function(req, res) {
    var rapperName = req.body.artist;
    var album = req.body.album;
    console.log(album);
    MongoClient.connect("mongodb://localhost:27017/rapGeniusData", function(err, db) {
        if(err) throw err;
        var songs = db.collection("songs");
        var query;
        album == "All" ? query = {artist: rapperName} : query = {artist: rapperName, album: album};
        songs.find(query, {name: 1, lyrics: 1, _id: 0}).toArray(function(err, docs) {
            async.parallel([
                function(parallelCallback) {
                    getFourRandomSongTitles(docs, parallelCallback);
                },
                function(parallelCallback) {
                    getFourRandomSongTitles(docs, parallelCallback);
                },
                function(parallelCallback) {
                    getFourRandomSongTitles(docs, parallelCallback);
                },
                function(parallelCallback) {
                    getFourRandomSongTitles(docs, parallelCallback);
                },
                function(parallelCallback) {
                    getFourRandomSongTitles(docs, parallelCallback);
                }],

                function(err, results) {
                    saveQuestionsAndRender(results, db, res);
                });
        });
    });
};

// get four song names
var getFourRandomSongTitles = function(docs, parallelCallback) {
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
    getFourRandomLines(docs, songNames, arr, parallelCallback);
};

// get four lines from a song
var getFourRandomLines = function(docs, songNames, arr, parallelCallback) {
    var correctIndex = Math.floor(Math.random() * (4)); // correctAnswer. Between 0 and 3
    var max = docs[arr[correctIndex]].lyrics.length - 4;
    var firstLineIndex = Math.floor(Math.random() * (max + 1));
    var lineIndexes = [firstLineIndex, firstLineIndex+1, firstLineIndex+2, firstLineIndex+3];
    var fourLines = __.map(lineIndexes, function(lineIndex) {return docs[arr[correctIndex]].lyrics[lineIndex]});
    parallelCallback(null, [fourLines, songNames, correctIndex]);
};

// save the results
// render the five different songs
var saveQuestionsAndRender = function(results, db, res) {
    var hexes = [];
    for(var i = 0; i < results.length; i++) {
        var fourLines = results[i][0];
        var songNames = results[i][1];
        var correctIndex = results[i][2];
        var hex = crypto.createHash('sha1').update(results[i][1].toString()).digest('hex');
        hexes.push(hex);
        var answer = {sha1: hex, answer: correctIndex};
        var answersCollection = db.collection("answers");
        answersCollection.insert(answer, function(err, docs) {
            if(err) throw err;
        });
    };
    res.render("game",
               {fourLines1: results[0][0], songNames1: results[0][1], sha1: hexes[0],
                fourLines2: results[1][0], songNames2: results[1][1], sha2: hexes[1],
                fourLines3: results[2][0], songNames3: results[2][1], sha3: hexes[2],
                fourLines4: results[3][0], songNames4: results[3][1], sha4: hexes[3],
                fourLines5: results[4][0], songNames5: results[4][1], sha5: hexes[4]});
};
