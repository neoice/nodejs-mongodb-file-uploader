// Module dependencies
var express = require('express');
var routes = require('./routes');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var http = require('http');

var app = module.exports = express.createServer();
var logStream = fs.createWriteStream('./server.log', {flags:'a'}); //truncates file if it exists, 'a' to append

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger({ stream : logStream }));  //logging middleware
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Config vars
var title = "fileShare";

// Routes

// Index
app.get('/', function(req, resp){
  resp.render('index', { title: title });
});

app.get('/get/:id', function(req, res){
        var sendme = { "group_id": req.params.id };
        var data = JSON.stringify(sendme);

        var options = {
                host: 'localhost', //change this to the db server url & port
                port: 3002,
                path: ('/file/group/' + req.params.id ),
                method: 'GET',
                headers: { 'Content-Type' : 'application/json' },
        };

	var a = function(files) {
		console.log(req.body);
		res.render('fileView-mongo', {title: "files!", files: files});
	};

        var req = http.request(options);

	req.end();

        req.on('error', function(e) {
                console.log('problem with request: ' + e.message);
        });

	req.on('response', function(response) {
		response.on('data', function(chunk) {
			a(JSON.parse(chunk));
			console.log('BODY: ' + chunk);
		});
	});

});


// Click on the images in browser to call this
app.get('/download/:userId/:file', function(req, res){
  var path = filesRoot + req.params.userId + '/' + req.params.file;
  res.download(path, function(err){
  	res.send(500);  //internal server error
  });
});


// file upload
app.post('/fileUpload/:id', function(req, res){
        var sendme = { "type": req.files.file.type, "path": req.files.file.path, "group_id": req.params.id };
        var data = JSON.stringify(sendme);

        var options = {
                host: 'localhost', //change this to the db server url & port
                port: 3002,
                path: ('/file/import/'),
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
        };

        var req = http.request(options);

        req.on('error', function(e) {
                console.log('problem with request: ' + e.message);
        });

        // write data to request body
        req.write(data);
        req.end();

	res.send(204);
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
