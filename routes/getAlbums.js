var MongoClient = require("mongodb").MongoClient;
var dataBaseKeys = require("../keys");
var DBUserName = dataBaseKeys.DATABASE_USER;
var DBPassword = dataBaseKeys.DATABASE_PWD;
var DBURL = "mongodb://"+DBUserName+":"+DBPassword+"@ds061188.mongolab.com:61188/heroku_app20763382";

exports.getAlbums = function(req, res) {
    MongoClient.connect(DBURL, function(err, db) {
        if(err) throw err;
        var collection = db.collection("songs");
        var artist = req.query.name;
        collection.aggregate([
            {$match:
             {artist: artist}
            },
            {$group:
             {_id: artist, albums: {$addToSet: "$album"}}
            },
            {$sort:
             {_id:1}
            }
        ], function(err, result) {
            var albums = result[0].albums;
            console.log('results',result);
            res.send(albums);
        });
    });
};

            
