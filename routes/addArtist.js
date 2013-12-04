var MongoClient = require("mongodb").MongoClient;
var scraper =require("./scraper.js");

exports.addArtist = function(req, res) {
    MongoClient.connect("mongodb://localhost:27017/rapGeniusdata", function(err, db) {
        if (err) throw err;
        var artist = req.body.
        scraper(artst);
    });
});
