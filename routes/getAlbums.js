var MongoClient = require("mongodb").MongoClient;

exports.getAlbums = function(req, res) {
    MongoClient.connect("mongodb://localhost:27017/rapGeniusData", function(err, db) {
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

            
