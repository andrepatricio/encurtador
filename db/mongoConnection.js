var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var _urlTeste = 'mongodb://localhost:27017/encurtador_test';
var _urlDesenv = 'mongodb://localhost:27017/encurtador';

var _url = process.env.NODE_ENV == 'test' ? _urlTeste : _urlDesenv;

var _find = function(collectionName, query, callback){	
	MongoClient.connect(_url, function(err, db){
		var collection = db.collection(collectionName);
		collection.find(query).toArray(function(err, docs) {
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

var _getNextSequence = function(counterName, callback){
	MongoClient.connect(_url, function(err, db){
		var counter = db.counter(counterName);
		console.log(counter);
	});
};

module.exports = {
	find : _find,
	save : _save
}