var MongoClient = require("mongodb").MongoClient;
var async = require("async");

exports.checkAnswer = function(req, res) {
    MongoClient.connect("mongodb://localhost:27017/rapGeniusData", function(err, db) {
        if(err) throw err;
        var answerCollection = db.collection("answers");
        var userInput = [req.body.songName1, req.body.songName2, req.body.songName3, req.body.songName4, req.body.songName5];
        var userAnswers = [];
        var queries = [];
        var answersLog = {};
        var numCorrectAnswers = 0;
        var checkAgainstDB = function(query, userAnswer, parallelCallback) {
            answerCollection.findOne(query, function(err, docs) {
                if(err) parallelCallback(err, null);
                if(userAnswer==docs.answer) {
                    numCorrectAnswers++;
                    parallelCallback(null, 'correct');
                } else {
                    parallelCallback(null, 'incorrect');
                }
            });
        };
        
        for (var i = 0; i < userInput.length; i++) {
            userAnswers.push(userInput[i].substr(userInput[i].length - 1));
            queries.push({sha1: userInput[i].substr(0, userInput[i].length - 1)});
        }
        async.parallel([
            function(parallelCallback) {
                checkAgainstDB(queries[0], userAnswers[0], parallelCallback);
            },
            function(parallelCallback) {
                checkAgainstDB(queries[1], userAnswers[1], parallelCallback);
            },
            function(parallelCallback) {
                checkAgainstDB(queries[2], userAnswers[2], parallelCallback);
            },
            function(parallelCallback) {
                checkAgainstDB(queries[3], userAnswers[3], parallelCallback);
            },
            function(parallelCallback) {
                checkAgainstDB(queries[4], userAnswers[4], parallelCallback);
            }
        ], function(err, results) {
            console.log(err, results);
            console.log(numCorrectAnswers);
            res.render("checkAnswer", {correctAnswers: numCorrectAnswers, results: results});                               
        }
        );
    });    
};
