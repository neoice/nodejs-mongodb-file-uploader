

// Module dependencies
var express = require('express');
var routes = require('./routes');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');

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
  // If we can't directly give a path to the database we'll have to save the file temporarily on the server
  
  // This needs to be changed to the path of the file in the database
  var path = 'public/files/' + req.params.userId + '/' + req.params.file;
  res.download(path, function(err){
  	res.send(500); //internal server error
  });
});


// file upload
app.post('/fileUpload/:id', function(req, res){
	console.log(req.params.id); //use this id as the collection
  	console.log(req.files.file); //this is the object that needs to be saved to the database
  	res.send(200); 
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
