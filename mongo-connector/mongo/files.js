var mongodb = require('mongodb');

var mongo_chunks = require('./chunks.js');
var chunker = new FileChunker('localhost', 27017);

FileConnector = function(host, port) {
	this.db = new mongodb.Db('test', new mongodb.Server(host, port, {auto_reconnect: false}, {strict:false}));
	this.db.open(function(){});
};

FileConnector.prototype.getCollection = function(callback) {
	this.db.collection('fs.files', function(error, collection) {
		if (error) {
			callback(error);
		}
		else {
			callback(null, collection);
		}
	});
};

FileConnector.prototype.findFile = function(md5, callback) {
	this.getCollection(function(error, collection) {
		if( error ) {
			callback(error);
		}
		else {
			console.log('FileConnector: finding file with md5 ' + md5);
			collection.findOne({md5: md5}, function(error, result) {
				if (error) {
					console.log(error);
					callback(error);
				}
				else {
					console.log('FileConnector: found file:');
					console.log(result);
					chunker.getFile(result.filename, function(error, data) {
						if (error) {
							console.log(error);
							callback(error);
						}
						else {
							callback(null, data);
						}
					});
				}
			});
		}
	});
};

FileConnector.prototype.saveFile = function(req, callback) {
	console.log('Mongo-FileConn: saveFile() called');
	chunker.saveFile(req, function(error) {
		if( error ) {
			callback(error);
		}
		else {
			callback();
		}
	});
};

FileConnector.prototype.getGroup = function(group_id, callback) {
	this.getCollection(function(error, collection) {
		if( error ) {
			callback(error);
		}
		else {
			console.log('FileConnector: finding files with group_id' + group_id);
			collection.find({"metadata.group_id": group_id}, function(error, result) {
				if (error) {
					console.log(error);
					callback(error);
				}
				else {
					console.log('FileConnector: found file:');
					console.log(result);
					chunker.getFile(result.filename, function(error, data) {
						if (error) {
							console.log(error);
							callback(error);
						}
						else {
							callback(null, data);
						}
					});
				}
			});
		}
	});
};
