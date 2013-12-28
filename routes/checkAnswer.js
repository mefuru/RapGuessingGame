var MongoClient = require("mongodb").MongoClient,
 async = require("async"),
 __ = require("underscore");

var dataBaseKeys = require("../keys");
var DBUserName = dataBaseKeys.DATABASE_USER;
var DBPassword = dataBaseKeys.DATABASE_PWD;
var DBURL = "mongodb://"+DBUserName+":"+DBPassword+"@ds061188.mongolab.com:61188/heroku_app20763382";

exports.checkAnswer = function(req, res) {
    MongoClient.connect(DBURL, function(err, db) {
        if(err) throw err;
        var answerCollection = db.collection("answers");
        var userInput = [req.body.songName1,
                         req.body.songName2,
                         req.body.songName3,
                         req.body.songName4,
                         req.body.songName5];
        var userAnswersAndQueries = [];
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
        // populate users answers and queries from user input
        for (var i = 0; i < userInput.length; i++) {
            userAnswersAndQueries.push({
                userAnswer: userInput[i].substr(userInput[i].length - 1),
                query:{sha1: userInput[i].substr(0, userInput[i].length - 1)}
            });
        }
        // for each question check answer against db and then render
        async.parallel(__.map(userAnswersAndQueries, function(userAnswerAndQuery) {
            return function(parallelCallback) {
                checkAgainstDB(userAnswerAndQuery.query, userAnswerAndQuery.userAnswer, parallelCallback);
            }
        }), function(err, results) {
              res.render("checkAnswer", {correctAnswers: numCorrectAnswers, results: results});                }
        );
    });    
};
