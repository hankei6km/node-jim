
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , api  = require('./routes/api')
  , http = require('http')
  , path = require('path')
  , socket_hwr = require('./apps/socket_hwr');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// test only
app.configure('test', function(){
  // ブラウザ上でのテスト用.
  app.use(express.static(path.join(__dirname, 'test', 'public')));
  app.use(express.errorHandler());
});

// Demo
app.get('/', routes.index);
app.get('/demo_keyboard', routes.demo_keyboard);
app.get('/demo_hwr', routes.demo_hwr);

// API
app.get('/JIMService/V1/conversion', api.conversion);

// ブラウザへライブラリを公開.
app.get('/libs/underscore.js', function(req, res, next){
  res.sendfile(
    path.join(__dirname, 'node_modules', 'underscore', 'underscore.js'));
});
app.get('/js/libs/roman.js', function(req, res, next){
  res.sendfile(
    path.join(__dirname, 'lib', 'roman.js'));
});


var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

socket_hwr(server);
