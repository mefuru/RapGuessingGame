var MongoClient = require("mongodb").MongoClient,
 utilsRegex = require("./utils/regex"),
 cheerio = require("cheerio"),
 request = require("request"),
 util = require("util"),
 async = require("async"),
 Song = require("./modules/songs"),
 _ = require("underscore");

var dataBaseKeys = require("./keys");
var DBUserName = dataBaseKeys.DATABASE_USER;
var DBPassword = dataBaseKeys.DATABASE_PWD;
var DBURL = "mongodb://"+DBUserName+":"+DBPassword+"@ds061188.mongolab.com:61188/heroku_app20763382";

var homeURL = "http://rapgenius.com";
// Process artist page
var getAlbumsForArtist = function(rapperName, callback) {
    geniusQuery.albumURLs(rapperName, function(error, albumURLs) {
        // For each album URL, run albumData fn in parallel
        async.parallel(_.map(albumURLs, function(albumURL) {
            return function (parallelCallback) {
                console.log("processing album", albumURL)
                geniusQuery.albumData(homeURL + albumURL, parallelCallback);
            };
        }), callback); // ultimate callback, res is arr of album obj
    });
};
var geniusQuery = {
// Fn accepts an artistName as per, and passes an array of album URLs to callback
    albumURLs: function(artistName, callback) {
        var artistURL = "http://rapgenius.com/artists/";
        request(artistURL + artistName, function (error, response, body) {
            if (error || response.statusCode !== 200) callback("Artist not found");
	    var $ = cheerio.load(body);
            rapperName = $("[property='og:title']").attr("content"); // To ensure name consistency
            // pass an array of album URLs to callback fn
            callback(null, $(".album_list li a").map(function() {
                return this.attr("href");
            }));
        });
    },
    // pass object containing album data (title, year and an array of song URLs) to callback
    albumData: function(baseAlbumURL, callback) {
	request(baseAlbumURL, function (error, response, body) {
            if (error || response.statusCode !== 200) callback(error);
            var $ = cheerio.load(body);
            var title = utilsRegex.obtainAlbumTitle($("h1.name a.artist")["0"]["next"]["data"]);
            var year = title.match(/\(\d{4}\)/);
            callback(null, {
                title: title,
                year: year === null ? -1 : year[0].replace(/(\(|\))/g,""),
                songURLs: $(".song_list .song_link").map(function() {
                    return this.attr("href");
                })
            });
        });
    },
    // pass song object to callback, containing song title, trackNo, lyrics array and songURL
    songData: function(songURL, callback) {
	    request(songURL, function (error, response, body) {
                console.log(error);
                if (error || response.statusCode !== 200) throw "Couldn't get song: " + songURL;
                var $ = cheerio.load(body);
                var title = utilsRegex.obtainSongTitle($("h1.song_title a")["0"]["next"]["data"])
                console.log("Getting song: ", title);
                var lyricsText = $(".lyrics_container .lyrics p").text().split("\n");
                callback(null, {
                    title: title,
                    trackNumber: $(".album_title_and_track_number").text().trim().split(" ")[1],
                    lyrics: _.filter(lyricsText, function(line) {
                        if(line.substring(1,5) == "Hook" || line.substring(1,6) == "Verse" || line == "") return false;
                        return true;
                    }),
                    URL: songURL
                });
        });
    }
};

// albums is an array of objects which contains the title, year and a songURLs []
var getSongsForAlbums = function(albums, callback) {
    // Pass an arr of functions to async.parallel. Each fn is getAlbumsSongs
    async.parallel(_.map(albums, function(album) {
        return function(parallelCallback) {
            getAlbumSongs(album, album.songURLs, parallelCallback);
        };
    }), function (errors, songs) { // ultime callback function to async. parallel
	callback(errors, songs);
    }
                  );
};

// function is passed an album object, songURLs array and a callback for async.parallel
var getAlbumSongs = function(album, songURLs, callback) {
    // For each songURL in songURLs, run geniusQuery.songData, passing it songURL
    async.parallel(_.map(songURLs, function(x) {
        return function(parallelCallback) {
            geniusQuery.songData(homeURL + x, function(error, song) {
                song.album = album;
                parallelCallback(error, song); // add song object to ult callback
            });
        };
    }), function (errors, songs) {
        // songs is an array of songs objects, each contains name, track,lyrics array and a songURL
	callback(errors, songs);
    });
};

// songsData is the songs object flattened out
var songDataToTrack = function(songData) {
    var track = new Song(songData.album.title, songData.songURL, songData.album.year);
    track.addSongName(songData.title);
    track.addTrackNumber(songData.trackNumber);
    track.addLyrics(songData.lyrics);
    track.addArtist(rapperName);
    return track; // return newly created track object
};

var renderHomepage = function(songsCollection, res) {
    songsCollection.aggregate([
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
        res.render("index", {artists: artists});
    });


};

var getData = function(rapperName, res) {
    getAlbumsForArtist(rapperName, function(error, albums) {
        MongoClient.connect(DBURL, function(err, db) {
            if(err) throw err;
            getSongsForAlbums(albums, function(error, songsData) {
                var tracks = _.map(_.flatten(songsData), songDataToTrack);
                console.log(tracks.length);
                var numCallbacks = 0;
                _.map(tracks, function(track) {
                    var query = {artist: track.artist, name: track.name};
                    var operator = track;
                    var options = {upsert: true};
                    var songsCollection = db.collection("songs");
                    songsCollection.update(query, operator, options, function (err, upserted) {
                        if(err) throw err;
                        console.dir("Storing data for track: " + track.name);
                        numCallbacks++;
                        if (numCallbacks == tracks.length) {
                            console.log("Songs successfully scraped, now rendering homepage");
                            res.send(200); // homepage refreshed using client side JS
                        }
                    });
                });
            });
        });
    });
};

module.exports = getData;
