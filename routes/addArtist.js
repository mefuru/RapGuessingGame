var scraper =require("./scraper.js");

exports.addArtist = function(req, res) {
    scraper(req.body.artist, res);
};
