// render homepage
var MongoClient = require("mongodb").MongoClient;

exports.index = function(req, res) {
    // obtain array of artists form DB
    MongoClient.connect("mongodb://localhost:27017/rapGeniusData", function(err, db) {
        if(err) throw err;
        var collection = db.collection("songs");
        collection.aggregate([
            {$group:
             { _id: "$artist" }
            },
            {$sort:
             {_id: 1}
            }
        ], function(err, result) {
            var artists = [];
            result.forEach (function(elem, index, array) {
                artists.push(elem._id);
            });
            db.close;
            res.render("index", {artists: artists});
        });
    });
};
