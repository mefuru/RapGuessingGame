var MongoClient = require("mongodb").MongoClient;
var scraper =require("./scraper.js");

exports.addArtist = function(req, res) {
    scraper(req.body.artist);
};
