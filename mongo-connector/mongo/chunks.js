var mongodb = require('mongodb');
var Grid = mongodb.Grid;

FileChunker = function(host, port) {
	this.db = new mongodb.Db('test', new mongodb.Server(host, port, {auto_reconnect: false}, {strict:false}));
	this.db.open(function(){});
	this.gridfs = new Grid(this.db, 'fs');
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

FileChunker.prototype.buildFile = function(files_id, callback) {
	this.gridfs.get(files_id, function(error, data) {
		if (error) {
			console.log(error);
			callback(error);
		}
		else {
	//		console.log(data.toString());
			callback(null, data);
		}
	});
};


/*
FileChunker.prototype.buildFile = function(files_id, callback) {
	this.getCollection(function(error, collection) {
		if( error ) {
			callback(error);
		}
		else {
			console.log('finding chunks for ' + files_id.toString() );
			var mongo_oid = mongodb.BSONPure.ObjectID( files_id.toString() );

			collection.find({files_id: mongo_oid}, function(error, result) {
				if (error) {
					console.log(error);
					callback(error);
				}
				else {
					console.log('found chunks!');

					console.log(result);

					for (chunk in result){
						console.log(chunk);
						}
					callback(null, result);
				}
			});
		}
	});
};
*/
