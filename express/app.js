
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

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

//function test(req, resp, next){
//  console.log("here");
//  next();
//}

// Routes

//index
app.get('/', routes.index);

//about
//app.get('/about', test, function(req, resp){
//  resp.render('about', { title: "test" });
//});
app.get('/about', routes.about);

//members
app.get('/members', routes.members);

//file upload
app.get('/uploadPage', routes.uploadPage);
//

app.get('/testview', routes.testview);

//not found
//app.get('*', routes.pageNotFound);
//


//post username form
app.post('/userNameForm', routes.userNameForm);
//
//ajax response
app.post('/ajaxResponse', routes.ajaxResponse);
//
//file upload
app.post('/fileUpload', routes.fileUpload);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
