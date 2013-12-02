var MongoClient = require("mongodb").MongoClient;

exports.checkAnswer = function(req, res) {
    MongoClient.connect("mongodb://localhost:27017/rapGeniusData", function(err, db) {
        if(err) throw err;
        var answer = req.body.songName;
        var collection = db.collection("songs");
        var collection2 = db.collection("answers");
        var stringPassed = req.body.songName;
        var userAnswer = answer.substr(answer.length - 1);
        var sha1 = answer.substr(0, answer.length - 1);
        var query = {sha1: sha1};
        collection2.findOne(query, function(err, doc) {
            console.log(userAnswer, doc.answer);
            if(userAnswer==doc.answer) {
                res.render("checkAnswer", {userAnswer: "correct"});
            } else {
                res.render("checkAnswer", {userAnswer: "wrong"});
            }                
        });
    });    
    // get answer from database using find operation
    // then pass relevant info to res.render function
};
