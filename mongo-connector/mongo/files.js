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
			console.log('finding file');
			collection.findOne({md5: md5}, function(error, result) {
				if (error) {
					console.log(error);
					callback(error);
				}
				else {
					console.log('found file');
					chunker.buildFile(result['_id'], function(error, data) {
						if (error) {
							console.log(error);
							callback(error);
						}
						else {
				//			console.log(data.toString());
							callback(null, data);
						}
					});
				}
			});
		}
	});
};
