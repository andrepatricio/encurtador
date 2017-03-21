var app = require('express')();
var bodyParser = require('body-parser');
var mongoDriver = require('./db/mongoConnection.js');
console.log(typeof process.argv[2]);
var mongo = mongoDriver(process.argv[2]);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var _host = 'http://and.re/';
var _buildStats = function(urls){
	var stats = {};
	stats.hits = urls.reduce(function(prev, current, index){
		return index == 1 ? prev.hits + current.hits : prev + current.hits;
	});
	stats.countUrls = urls.length;
	stats.topUrls = urls.sort(function(element1, element2){
		if(element1.hits > element2.hits){
			return -1;
		} 
		if(element1.hits < element2.hits){
			return 1;
		}
		return 0;
	});
	if(urls.length > 10){
		stats.topUrls = stats.topUrls.slice(1,11);
	}
	return stats;
}

app.get('/urls/:id', function(request, response){
	var urlId = request.params.id;
	var query = {'urls.id': urlId};
	var projection = {'id': 1,'urls.$': 1};
	mongo.findOne('users', query, projection, function(err, result){
		if(err){
			response.status(500).end();
		}
		if(!result){
			response.status(404).end();
		}
		var criteria = {'url.id': urlId};
		var update = {$inc : {'urls.$.hits':1}};
		mongo.update('users', criteria, update, function(err, updateResult){
			if(err){
				response.status(500).end();
			}
			var urlDestino = result.urls[0].url;
			response.redirect(301, urlDestino);
		});
		
	});
});

app.get('/stats/:id', function(request, response){
	var query = {'urls.id': request.params.id};
	mongo.findOne('users', query, {'urls.$': 1}, function(err, result){
		if(err){
			response.status(500).end();
		}
		if(!result){
			response.status(404).end();
		} else {
			response.status(200).json(result.urls.pop());
		}
	});
});

app.get('/stats', function(request, response){
	var query = {'urls': {$exists: true ,$not: {$size: 0}}};
	var projection = {'_id' : 0 ,'urls': 1};
	mongo.find('users', query, projection, function(err, result){
		if(err){
			response.status(500).end();
		}
		if(!result){
			response.status(404).end();
		}
		var allUrls = result.reduce(function(element1, element2, index){
			if(index == 1){
				return element1.urls.concat(element2.urls)
			}
			return element1.concat(element2.urls)
		});
		response.status(200).json(_buildStats(allUrls));
	});
});

app.get('/users/:userId/stats', function(request, response){
	var query = {'id': request.params.userId, 'urls': {$exists: true ,$not: {$size: 0}}};
	mongo.findOne('users', query, {}, function(err, result){
		if(err){
			response.status(500).end();
		}
		if(!result){
			response.status(404).end();
		}else{
			response.status(200).json(_buildStats(result.urls));
		}
	});
});

app.post('/users', function(request, response){
	var body = request.body;
	var user = {
		id : body.id
	}
	mongo.find('users', user, {}, function(err, result){
		if(err){
			response.status(500).end();
		}
		if(result.length > 0){
			response.sendStatus(409);
		}
		mongo.save('users', user, function(err, saveResult){
	        if(err){
	            response.status(500).end();
	        }
	        response.status(201).json(user);
	    });
	});
});

app.post('/users/:userId/urls', function(request, response){

	mongo.findAndModify('counters', {_id: 'urlsId'}, {$inc: {seq : 1}}, function(err, result){
		if(err){
			response.status(500).end();
		}
		var body = request.body;
		var url = {};
		url.id = result.value.seq.toString();
		url.hits = 0;
		url.url = request.body.url;
		var urlIdBuffer = new Buffer(url.id);
		url.shortUrl = _host+urlIdBuffer.toString('base64');
		var criteria = {id: request.params.userId};
		var update = {$push: {urls : url}}

		mongo.update('users', criteria, update, function(err, updateResult){
			if(err){
				response.status(500).end();
			}
			response.status(201).json(url);
		});
	});
});

app.delete('/users/:userId', function(request, response){
	var query = {id: request.params.userId};
	mongo.remove('users', query, function(err, result){
		if(err){
			response.status(500).end();
		}
		response.status(200).end();
	});
});

app.delete('/urls/:urlId', function(request, response){
	var query = {'urls.id': request.params.urlId};
	var projection = {'id' : 1, 'urls.$': 1}
	mongo.findOne('users', query, projection, function(err, result){
		var query = {'id': result.id};
		var update = {$pull : {'urls': result.urls[0]}};
		mongo.update('users', query, update, function(err, updateResult){
			console.log(result);
			if(err){
				response.status(500).end();
			}
			response.status(200).end();
		})
	});
});

app.listen(3000, function(){
    console.log('Encurtador on na porta 3000');
});