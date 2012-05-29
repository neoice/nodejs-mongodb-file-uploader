var mongodb = require('mongodb');
var GridStore = mongodb.GridStore;
var fs = require('fs');

FileChunker = function(host, port) {
	this.db = new mongodb.Db('test', new mongodb.Server(host, port, {auto_reconnect: false}, {strict:false}));
	this.db.open(function(){});
};

FileChunker.prototype.saveFile = function(file, callback) {
	// exceedingly primative save file!
	self = this;
	var gridfs = new GridStore(self.db, file, 'w');

	gridfs.writeFile(file, function(error) {
		if (error) {
			callback(error);
		}
		else {
			callback();
		}
	});
};

FileChunker.prototype.buildFile = function(file, callback) {
	self = this;
	console.log('FileChunker  : assembling file named ' + file);

	var gridfs = new GridStore(self.db, file, 'r');

	gridfs.open(function(error, gs) {
		gridfs.seek(0, function() {
			gridfs.read(function(error, data) {
				callback(error, data)
			});
		});
	});
};
