/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var app = module.exports = express.createServer();


// mongodb
var mc = require('./mongo.js');
var connector = new MongoConnector('localhost', 27017);

// express configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
  app.use(express.errorHandler());
});

// start the server
app.listen(3002, function(){
  console.log("mongodb-connector listening on port %d in %s mode", app.address().port, app.settings.env);
});

// user management
app.get ('/finduser/:email', function(req, res) {
	connector.findUser('neoice@neoice.net', function(error, result) {
		console.log(result);
		res.end( JSON.stringify(result) );
	});
});

app.post ('/adduser/', function(req, res) {
	console.log(req.body);
	connector.addUser(req.body, function(error, result) {
		res.send(200);
	});
});
