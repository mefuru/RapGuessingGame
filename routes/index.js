// Render homepage, passing array of artists and their albums
var MongoClient = require("mongodb").MongoClient;

exports.index = function(req, res) {
    MongoClient.connect("mongodb://localhost:27017/rapGeniusData", function(err, db) {
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
                var artistAndAlbum = {artist: result[i]._id, albums: result[i].albums};
                artistsAndAlbums.push(artistAndAlbum);
            }
            res.render("index", {artistsAndAlbums: artistsAndAlbums});
        });
    });
};
