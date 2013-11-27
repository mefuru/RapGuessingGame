;
// songs object constructor
var Song = function (albumTitle, songURL, year) {
    this.name = "";
    this.artist = "";    
    this.lyrics = [];
    this.trackNumber = "";
    this.album = albumTitle;
    this.year = year;
    this.link = songURL;
};

// prototype functions
// append methods
Song.prototype.addSongName = function (SongName) {
    this.name = SongName;
}

Song.prototype.addYear = function (year) {
    this.year = year;
}

Song.prototype.addAlbum = function (albumName) {
    this.album = albumName;
}

Song.prototype.addTrackNumber = function (trackNumber) {
    this.trackNumber = trackNumber;
}

Song.prototype.addLink = function (URL) {
    this.link = URL;
}

Song.prototype.addArtist = function (rapper) {
    this.artist = rapper;
}

Song.prototype.addLyrics = function (lyrics) {
    this.lyrics = lyrics;
}

// console print/query methods
Song.prototype.printFourLyricsFromASong = function () {
    var max = this.lyrics.length - 4;
    var min = 0;
    var x = Math.floor(Math.random() * (max - min + 1) + min);
    console.log(this.lyrics[x]);
    console.log(this.lyrics[x+1]);
    console.log(this.lyrics[x+2]);
    console.log(this.lyrics[x+3]);
}


module.exports = Song;
