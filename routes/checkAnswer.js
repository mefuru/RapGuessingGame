var MongoClient = require("mongodb").MongoClient;

exports.checkAnswer = function(req, res) {
    MongoClient.connect("mongodb://localhost:27017/rapGeniusData", function(err, db) {
        if(err) throw err;
        var answer1 = req.body.songName1;
        var answer2 = req.body.songName2;
        var answer3 = req.body.songName3;
        var answer4 = req.body.songName4;
        var answer5 = req.body.songName5;
        var answerCollection = db.collection("answers");
        var stringPassed = req.body.songName;
        var userAnswer1 = answer1.substr(answer1.length - 1);
        var userAnswer2 = answer1.substr(answer1.length - 1);
        var userAnswer3 = answer1.substr(answer1.length - 1);
        var userAnswer4 = answer1.substr(answer1.length - 1);
        var userAnswer5 = answer1.substr(answer1.length - 1);
        var sha1 = answer1.substr(0, answer1.length - 1);
        var query = {$or:[{sha1 :answer1.substr(0, answer1.length - 1)},
                          {sha1 :answer2.substr(0, answer1.length - 1)},
                          {sha1 :answer3.substr(0, answer1.length - 1)},
                          {sha1 :answer4.substr(0, answer1.length - 1)},
                          {sha1 :answer5.substr(0, answer1.length - 1)},
      ]};
        answerCollection.find(query).toArray(function(err, docs) {
            console.log(docs.length);
            if(userAnswer1==docs[0].answer) {
                res.render("checkAnswer", {userAnswer: "correct"});
            } else {
                res.render("checkAnswer", {userAnswer: "wrong"});
            }                
        });
    });    
    // get answer from database using find operation
    // then pass relevant info to res.render function
};
