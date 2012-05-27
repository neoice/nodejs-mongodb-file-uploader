var mongodb = require('mongodb');

FileChunker = function(host, port) {
	this.db = new mongodb.Db('test', new mongodb.Server(host, port, {auto_reconnect: false}, {strict:false}));
	this.db.open(function(){});
};

FileChunker.prototype.getCollection = function(callback) {
	this.db.collection('fs.chunks', function(error, collection) {
		if (error) {
			callback(error);
		}
		else {
			callback(null, collection);
		}
	});
};

FileChunker.prototype.buildFile = function(fileis_id, callback) {
	this.getCollection(function(error, collection) {
		if( error ) {
			callback(error);
		}
		else {
			console.log('finding chunks');
			collection.find({files_id: files_id}, function(error, result) {
				if (error) {
					console.log(error);
					callback(error);
				}
				else {
					console.log('found chunks!');
					callback(null, result);
				}
			});
		}
	});
};
