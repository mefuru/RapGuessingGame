;
var __ = require("underscore");
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
        collection.count({artist: rapperName}, function(err, count) {
            var query = {artist: rapperName};
            var options = {skip: Math.floor((Math.random()*(count-1))), limit: 1};
            collection.find(query, options).toArray(function(err, docs) {
                if(err) throw err;
                var max = docs[0].lyrics.length - 4;
                var min = 0;
                var firstLineIndex = Math.floor(Math.random() * (max - min + 1) + min);
                for (var i = 0; i < 4; i++) {
                    fourLines.push(docs[0].lyrics[firstLineIndex+i]);
                }
                var correctAnswer = docs[0].name;
                fourSongNames.push(correctAnswer);
                db.close;
                var options = {skip: Math.floor((Math.random()*(count-1))), limit: 1};
                collection.find(query, options).toArray(function(err, docs) {
                    if(err) throw err;
                    fourSongNames.push(docs[0].name);
                    db.close;
                    var options = {skip: Math.floor((Math.random()*(count-1))), limit: 1};
                    collection.find(query, options).toArray(function(err, docs) {
                        if(err) throw err;
                        fourSongNames.push(docs[0].name);
                        db.close;
                        var options = {skip: Math.floor((Math.random()*(count-1))), limit: 1};
                        collection.find(query, options).toArray(function(err, docs) {
                            if(err) throw err;
                            fourSongNames.push(docs[0].name);
                            // save hex and answer to database, new collection
                            var hex = crypto.createHash('sha1').update(fourLines.join()).digest('hex');
                            var possibleAnswers = __.shuffle(fourSongNames);
                            var correctIndex = __.indexOf(possibleAnswers, correctAnswer);
                            var answer = {sha1: hex, answer: correctIndex};
                            collection2.insert(answer, function(err, docs) {
                                db.close;
                                res.render("game", {fourLines: fourLines, songNames: possibleAnswers, sha1: hex});
                            });
                        });
                    });
                });
            });
        });
    });
};


// ;
// var __ = require("underscore");
// var crypto = require("crypto");

// var MongoClient = require("mongodb").MongoClient;
// exports.runGame = function(req, res) {
//     var rapperName = req.body.artist;
//     var fourLines = [];
//     var fourSongNames = [];
//     MongoClient.connect("mongodb://localhost:27017/rapGeniusData", function(err, db) {
//         if(err) throw err;
//         var collection = db.collection("songs");
//         var collection2 = db.collection("answers");
//         collection.count({artist: rapperName}, function(err, count) {
//             var query = {artist: rapperName};
//             var options = {skip: Math.floor((Math.random()*(count-1))), limit: 1};
//             collection.find(query, options).toArray(function(err, docs) {
//                 if(err) throw err;
//                 var max = docs[0].lyrics.length - 4;
//                 var min = 0;
//                 var firstLineIndex = Math.floor(Math.random() * (max - min + 1) + min);
//                 for (var i = 0; i < 4; i++) {
//                     fourLines.push(docs[0].lyrics[firstLineIndex+i]);
//                 }
//                 // console.log(docs[0].name);
//                 var correctAnswer = docs[0].name;
//                 fourSongNames.push(correctAnswer);
//                 db.close;
                
//                 var options = {skip: Math.floor((Math.random()*(count-1))), limit: 1};
//                 collection.find(query, options).toArray(function(err, docs) {
//                     if(err) throw err;
//                     fourSongNames.push(docs[0].name);
//                     db.close;

//                 });
//                 var options = {skip: Math.floor((Math.random()*(count-1))), limit: 1};
//                 collection.find(query, options).toArray(function(err, docs) {
//                     if(err) throw err;
//                     fourSongNames.push(docs[0].name);
//                     db.close;
//                 });
//                 var options = {skip: Math.floor((Math.random()*(count-1))), limit: 1};
//                 collection.find(query, options).toArray(function(err, docs) {
//                     if(err) throw err;
//                     fourSongNames.push(docs[0].name);
//                     // save hex and answer to database, new collection
//                     var hex = crypto.createHash('sha1').update(fourLines.join()).digest('hex');
//                     var possibleAnswers = __.shuffle(fourSongNames);
//                     var correctIndex = __.indexOf(options, correctAnswer);
//                     var answer = {sha1: hex, answer: correctIndex};
//                     collection2.insert(answer, function(err, docs) {
//                         db.close;
//                         res.render("game", {fourLines: possibleAnswers, sha1: hex});
//                     });
//                 });
//             });

//         });
//     });
// };
