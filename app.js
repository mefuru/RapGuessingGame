
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var runGame = require('./routes/runGame');
// var user = require('./routes/user');
var http = require('http');
var path = require('path');
var cons = require('consolidate');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', cons.swig);
app.use(express.bodyParser()); // required for POST requests
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
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
app.post('/getArtist', runGame.runGame);
// antonio's CODE
// app.post('/getArtist', function(req, res){
// //going to db and create question and answer

// var questionId="dasd"
// var answer = "dasd"
// answers[questionId] = answer
// });

// app.post('/checAnswer', function(req, res){
//   var questionId = req.
//  var answer = req.

//  if anwers[questions] == anwer
// })

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
