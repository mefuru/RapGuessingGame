// Render homepage, passing array of artists and their albums
var MongoClient = require("mongodb").MongoClient;
// var dataBaseKeys = require("../keys");
var DBUserName = process.env.DATABASE_USER;
var DBPassword = process.env.DATABASE_PWD;

var DBURL = "mongodb://"+DBUserName+":"+DBPassword+"@ds061188.mongolab.com:61188/heroku_app20763382";
exports.index = function(req, res) {
    MongoClient.connect(DBURL, function(err, db) {
        if(err) throw err;
        var collection = db.collection("songs");
        collection.aggregate([
            {$group:
             {_id: "$artist", albums: {$addToSet: "$album"}}
            },
            {$sort:
             {_id: 1}
            }
        ], function(err, result) {
            var artistsAndAlbums = [];
            for(var i=0; i<result.length; i++) {
                artistsAndAlbums.push({artist: result[i]._id, albums: result[i].albums});
            }
            res.render("index", {artistsAndAlbums: artistsAndAlbums});
        });
    });
};
