var express = require('express');
var routes = require('./routes');
var runGame = require('./routes/runGame');
var addArtist = require('./routes/addArtist');
var checkAnswer = require('./routes/checkAnswer');
var getAlbums = require('./routes/getAlbums');
var http = require('http');
var path = require('path');
var cons = require('consolidate');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');

var app = express();

// var config = require('./config');
// var User = require('../models/user');

// passport.use(new FacebookStrategy({
//     clientID: config.development.fb.appID,
//     clientSecret: config.development.fb.appSecret,
//     callbackURL: config.development.fb.url = 'fbauthed'
// }, function(accessToken, refreshToken, profile, done) {
//     process.nextTick(function() {
        
//     });
// }


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', cons.swig);
app.use(express.cookieParser());
app.use(express.session({secret:"SECRETSECRET"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.bodyParser());
app.use(express.logger('app'));
// use.devlalo(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
var answers={};
app.get('/', routes.index);
app.get('/getAlbums', getAlbums.getAlbums);
app.post('/getArtist', runGame.runGame);
app.post('/checkAnswer', checkAnswer.checkAnswer);
app.post('/addArtist', addArtist.addArtist);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
