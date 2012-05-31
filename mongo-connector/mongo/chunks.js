var mongodb = require('mongodb');
var GridStore = mongodb.GridStore;
var fs = require('fs');

FileChunker = function(host, port) {
	this.db = new mongodb.Db('test', new mongodb.Server(host, port, {auto_reconnect: false}, {strict:false}));
	this.db.open(function(){});
};

FileChunker.prototype.saveFile = function(file, callback) {
	self = this;
	console.log('FileChunker.save: file data:');
	console.log(file);

	// parse the file data out for easy use
	var path = file.path;
	var type = file.type;

	var gridfs = new GridStore(self.db, path, 'w', {'content_type': type});

	gridfs.writeFile(path, function(error) {
		if (error) {
			callback(error);
		}
		else {
			callback();
		}
	});
};

FileChunker.prototype.getFile = function(file, callback) {
	self = this;
	console.log('FileChunker.get: assembling file named ' + file.path);

	var gridfs = new GridStore(self.db, file, 'r');

	console.log('FileChunker.get:');


	gridfs.open(function(error, gs) {
		gridfs.seek(0, function() {
			gridfs.read(function(error, data) {
				console.log(gridfs.contentType);
				callback(error, {'type': gridfs.contentType, 'data': data})
			});
		});
	});
};
