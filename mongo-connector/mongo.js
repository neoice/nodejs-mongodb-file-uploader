var mongodb = require('mongodb');

MongoConnector = function(host, port) {
	this.db = new mongodb.Db('test', new mongodb.Server(host, port, {auto_reconnect: false}, {strict:false}));
	this.db.open(function(){});
};

MongoConnector.prototype.getCollection = function(callback) {
	this.db.collection('users', function(error, users_collection) {
		if (error) {
			callback(error);
		}
		else {
			callback(null, users_collection);
		}
	});
};

MongoConnector.prototype.findUser = function(email, callback) {
	this.getCollection(function(error, user_collection) {
		if( error ) {
			callback(error);
		}
		else {
			console.log('finding user');
			user_collection.findOne({email: email}, function(error, result) {
				if (error) {
					console.log(error);
					callback(error);
				}
				else {
					console.log('found user');
					callback(null, result);
				}
			});
		}
	});
};

MongoConnector.prototype.addUser = function(user_object, callback) {
	// workaround for this changing later on.
	// incidently, self is a reserved word in vim
	// and appears to be an idiom others have used before:
	// http://www.alistapart.com/articles/getoutbindingsituations
	var self = this;

	this.getCollection(function(error, user_collection) {
		if( error ) {
			callback(error);
		}
		else {
			self.findUser(user_object['email'], function(error, result) {
				if ( error ) {
					callback(error);
				}
				else {
					if ( result ) {
						console.log('user exists already!');
						callback('exists', null);
					}
					else {
						console.log('adding user');
						user_collection.insert(user_object, function(error, result) {
							if (error) {
								console.log(error);
								callback(error);
							}
							else {
								console.log('added user');
								callback(null, result);
							}
						});
					}
				}
			});
		}
	});
};

MongoConnector.prototype.authUser = function(user_object, callback) {
	var self = this;

	this.getCollection(function(error, user_collection) {
		if( error ) {
			callback(error);
		}
		else {
			self.findUser(user_object['email'], function(error, result) {
				if ( error ) {
					callback(error);
				}
				else {
					if ( result ) {
						console.log('user found, comparing password...');

						if (user_object['password'] === result['password']) {
							console.log('password match!');
							callback(null, true);
						}
						else {
							callback('bad password', null);
						}
					}
					else {
						console.log('no user found');
						callback('bad email', null);
					}
				}
			});
		}
	});
};
