var MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost:27017/rapGeniusData", function(err, db) {
    if(err) throw err;
    var collection = db.collection("songs");
    collection.aggregate([
        {$group:
            { _id: "$artist" }
        }
    ], function(err, result) {
        console.log(result);
        var artists = [];
        result.forEach (function(elem, index, array) {
            artists.push(elem._id);
        });
        console.log(artists);
        db.close;
        process.exit(0);
    });
});
