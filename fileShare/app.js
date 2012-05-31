

// Module dependencies
var express = require('express');
var routes = require('./routes');
var path = require('path');
var fs = require('fs');
var http = require('http');

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
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


// Root folder
var title = "fileShare";
var filesRoot = "public/files";

// Routes

// Index
app.get('/', function(req, resp){
  resp.render('index', { title: title })
});

app.get('/get/:id', function(req, res){

	// The id is the random id given when files are uploaded, client will use this to find files.

	// Change this fs.readdir to the asycnch mongodb collection lookup.
	// Basically get all the files in the collection so we can say and id equals a collection.
	// Then pass the array of file objects to files in the render below.
	fs.readdir(path.join(filesRoot, req.params.id), function(err, files){
		if(err){
			res.render('notFound', { title : title }); //make this page
		}else{
		
			// Give the files array to this function.
			res.render('fileView', { title : title, files : files, userId : req.params.id });
		}
	});
});


// Click on the images in browser to call this
app.get('/download/:userId/:file', function(req, res){
  
  // This needs to be changed to the path of the file
  var path = 'public/files/' + req.params.userId + '/' + req.params.file;
  res.download(path, function(err){
  	res.send(500); //internal server error
  });
});


// file upload
app.post('/fileUpload/:id', function(req, res){
	var data = JSON.stringify(req.files);
	
	var options = {
  		host: 'localhost', //change this to the db server url & port
  		port: 3000,
  		path: ('/fileUpload/' + req.params.id),
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
  	res.send(200); 
});

app.listen(4000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

