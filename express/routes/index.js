
//Dbase
var Users = [];
var title = "fileShare";

var createPerson = function(first, last){
  var temp = {};
  temp.first = first;
  temp.last = last;
  return temp;
}


////////////////////////////////////////////////////
//GET requests
////////////////////////////////////////////////////

//GET home page
exports.index = function(req, resp){
  resp.render('index', { title: title })
};


//GET about page
exports.about = function(req, resp){
  resp.render('about', { title: title })
};


//GET members page
exports.members = function(req, resp){
  resp.render('members', { title : title, Users : Users });
};

//GET upload page
exports.uploadPage = function(req, res){
  res.render('uploadPage', {title: title});
};

exports.testview = function(req, res){
  res.render('testview', {title:title});
};

//GET unknown url
//exports.pageNotFound = function(req,resp){
//  resp.send("<html>URL not found on this server.</html>",404);
//};



////////////////////////////////////////////////////
//POST requests
////////////////////////////////////////////////////

//POST username form
exports.userNameForm = function(req, resp){
  //save stuff in dbase
  Users.push(createPerson(req.body.user.first, req.body.user.last));
  resp.redirect('/about',302);
};

//POST username form ajax style
exports.ajaxResponse = function(req,resp){
  console.log(req.body);
  Users.push(createPerson(req.body.user.first, req.body.user.last));
  console.log("User list:");
  console.log(Users);
  resp.send(Users);
}

//POST file
exports.fileUpload = function(req, resp){
  console.log(req.files.file);
  resp.send({response: "got file"});
}







