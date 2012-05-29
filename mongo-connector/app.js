/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var app = module.exports = express.createServer();


// mongodb
var mongo_users = require('./mongo/users.js');
var mongo_files = require('./mongo/files.js');
var user_connector = new UserConnector('localhost', 27017);
var file_connector = new FileConnector('localhost', 27017);

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
app.get ('/user/find/:email', function(req, res) {
	user_connector.findUser(req.params.email, function(error, result) {
		console.log(result);
		if (result) {
			res.end( JSON.stringify(result) );
		}
		else {
			res.send(404);
		}

	});
});

app.post ('/user/add/', function(req, res) {
	console.log(req.body);
	user_connector.addUser(req.body, function(error, result) {
		if (error)
		{
			res.end( JSON.stringify(error) );
		}
		else {
			res.send(200);
		}
	});
});

app.post ('/user/auth/', function(req, res) {
	console.log(req.body);
	user_connector.authUser(req.body, function(error, result) {
		if (error)
		{
			res.send(401);
		}
		else {
			res.send(200);
		}
	});
});


app.get ('/file/:id', function(req, res) {
	file_connector.findFile(req.params.id, function(error, result) {
		if (result)
		{
			// hardcode the content type for now
			res.setHeader("Content-Type", "image/jpeg");

			// workaround for gridfs.get() returning the file offset by 4 bytes.
			// dev says it's not a bug LOL
			var ffs = result.slice(4);

			// SEND OUR RESPONSE BABY
			res.write(ffs);
			res.end();
		}
		else {
			res.send(404);
		}
	});
});

app.post ('/file/upload/', function(req, res) {
		console.log("FILE UPLOAD HIT");
	file_connector.saveFile(req, function(error, result) {
		if (result)
		{
			res.end();
		}
		else {
			res.send(500);
		}
	});
});

app.post ('/file/import/', function(req, res) {
		console.log("FILE IMPORT!");

		console.log(req.body);

		console.log(typeof(req.body));

		file_connector.saveFile(req.body.path);

		//console.log(req);

		res.send(200);
});
