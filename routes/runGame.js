;
var __ = require("underscore");
// Get four random lines fo
var MongoClient = require("mongodb").MongoClient;

exports.runGame = function(req, res) {
    var rapperName = req.body.artist;
    var fourLines = [];
    var fourSongNames = [];
    MongoClient.connect("mongodb://localhost:27017/rapGeniusData", function(err, db) {
        if(err) throw err;
        var collection = db.collection("songs");
        collection.count({artist: rapperName}, function(err, count) {
            var query = {artist: rapperName};
            var options = {skip: Math.floor((Math.random()*(count-1))), limit: 1};
            collection.find(query, options).toArray(function(err, docs) {
                if(err) throw err;
                var max = docs[0].lyrics.length - 4;
                var min = 0;
                var x = Math.floor(Math.random() * (max - min + 1) + min);
                fourLines.push(docs[0].lyrics[x]);
                fourLines.push(docs[0].lyrics[x+1]);
                fourLines.push(docs[0].lyrics[x+2]);
                fourLines.push(docs[0].lyrics[x+3]);
                console.log(fourLines);
                fourSongNames.push(docs[0].name);
                db.close;
            });
            var options = {skip: Math.floor((Math.random()*(count-1))), limit: 1};
            collection.find(query, options).toArray(function(err, docs) {
                if(err) throw err;
                fourSongNames.push(docs[0].name);
                db.close;
                
            });
            var options = {skip: Math.floor((Math.random()*(count-1))), limit: 1};
            collection.find(query, options).toArray(function(err, docs) {
                if(err) throw err;
                fourSongNames.push(docs[0].name);
                db.close;
            });
            var options = {skip: Math.floor((Math.random()*(count-1))), limit: 1};
            collection.find(query, options).toArray(function(err, docs) {
                if(err) throw err;
                fourSongNames.push(docs[0].name);
                db.close;
                console.log(fourSongNames);
                res.render("game", {fourLines: fourLines, songNames: __.shuffle(fourSongNames)});
            });
        });
    });
};

