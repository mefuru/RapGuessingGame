var MongoClient = require("mongodb").MongoClient;

exports.checkAnswer = function(req, res) {
    MongoClient.connect("mongodb://localhost:27017/rapGeniusData", function(err, db) {
        if(err) throw err;
        var answersLog = {};
        var answerCollection = db.collection("answers");

        var answer1 = req.body.songName1;
        var userAnswer1 = answer1.substr(answer1.length - 1);
        var sha1 = answer1.substr(0, answer1.length - 1);
        var query1 = {sha1:sha1};
        
        var answer2 = req.body.songName2;
        var userAnswer2 = answer2.substr(answer2.length - 1);
        var sha2 = answer2.substr(0, answer2.length - 1);
        var query2 = {sha1: sha2};
        

        var answer3 = req.body.songName3;
        var userAnswer3 = answer3.substr(answer3.length - 1);
        var sha3 = answer3.substr(0, answer3.length - 1);
        var query3 = {sha1: sha3}
        
        var answer4 = req.body.songName4;
        var userAnswer4 = answer4.substr(answer4.length - 1);
        var sha4 = answer4.substr(0, answer4.length - 1);
        var query4 = {sha1: sha4};
        
        var answer5 = req.body.songName5;
        var userAnswer5 = answer5.substr(answer5.length - 1);
        var sha5 = answer5.substr(0, answer5.length - 1);
        var query5 = {sha1: sha5};
        
        var numCorrectAnswers = 0;
        answerCollection.findOne(query1, function(err, docs) {
            if(userAnswer1==docs.answer) {
                answersLog.one = 'correct';
                numCorrectAnswers++;
            } else {
                answersLog.one = 'incorrect';
            }
            answerCollection.findOne(query3, function(err, docs) {
                if(userAnswer3==docs.answer) {
                    answersLog.three = 'correct';
                    numCorrectAnswers++;
                } else {
                    answersLog.three = 'incorrect';
                }
                answerCollection.findOne(query4, function(err, docs) {
                    if(userAnswer4==docs.answer) {
                        answersLog.four = 'correct';
                        numCorrectAnswers++;
                    } else {
                        answersLog.four = 'incorrect';
                    }
                    answerCollection.findOne(query5, function(err, docs) {
                        if(userAnswer1==docs.answer) {
                            answersLog.five = 'correct';
                            numCorrectAnswers++;
                        } else {
                            answersLog.five = 'incorrect';
                        }
                        res.render("checkAnswer", {correctAnswers: numCorrectAnswers,
                                                   userAnswer1: answersLog['one'],
                                                   userAnswer2: answersLog['two'],
                                                   userAnswer3: answersLog['three'],
                                                   userAnswer4: answersLog['four'],
                                                   userAnswer5: answersLog['five']});                
                    });            
                });        
            });
            
        });

        
        
        
        
    });    
    // get answer from database using find operation
    // then pass relevant info to res.render function
};
