/**
 * Module dependencies.
 */

var express = require('express');
    http = require('http'),
    fs = require('fs'),
    xmlparser = require('express-xml-bodyparser'),
    cookieParser = require('cookie-parser'),
    path = require('path');

var app = express();

// all environments

app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon(path.join(__dirname,'/webroot/favicon.ico')));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.methodOverride());
app.use(xmlparser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

fs.readdirSync('./controllers').forEach(function (file) {
    if(file.substr(-3) == '.js') {
        route = require('./controllers/' + file);
        route(app);
    }
});
