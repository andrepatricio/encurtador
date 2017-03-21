var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var _url = '';

module.exports = function(url){
	_url = url;
	return {
		find : _find,
		findOne: _findOne,
		save : _save,
		remove: _remove,
		update: _update,
		findAndModify: _findAndModify 
	};
}

var _find = function(collectionName, query, projection, callback){	
	MongoClient.connect(_url, function(err, db){
		var collection = db.collection(collectionName);
		collection.find(query, projection).toArray(function(err, docs) {
			callback(err, docs);
			db.close();
		});
	});
};

var _findOne = function(collectionName, query, projection, callback){	
	MongoClient.connect(_url, function(err, db){
		var collection = db.collection(collectionName);
		collection.findOne(query, projection, function(err, docs) {
			callback(err, docs);
			db.close();
		});
	});
};

var _save = function(collectionName, obj, callback){
	MongoClient.connect(_url, function(err, db){
		var collection = db.collection(collectionName);
		collection.insertOne(obj, function(err, result){
			callback(err, result);
			db.close();
		});
	});
};

var _remove = function(collectionName, query, callback){
	MongoClient.connect(_url, function(err, db){
		var collection = db.collection(collectionName);
		collection.remove(query, function(err, result){
			callback(err, result);
			db.close();
		});
	});
}

var _update = function(collectionName, criteria, update, callback){
	MongoClient.connect(_url, function(err, db){
		var collection = db.collection(collectionName);
		collection.update(criteria, update, function(err, result){
			callback(err, result);
			db.close();
		});
	});
}

var _findAndModify = function(collectionName, criteria, update, callback){
	MongoClient.connect(_url, function(err, db){
		var collection = db.collection(collectionName);
		collection.findAndModify(criteria, [],  update, {}, function(err, result){
			callback(err, result);
			db.close();
		});
	});
}

