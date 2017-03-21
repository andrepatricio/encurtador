var app = require('express')();
var bodyParser = require('body-parser');
var mongo = require('./db/mongoConnection.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/urls/:id', function(request, response){
	var urlId = request.params.id;
	//var query = { urls: { $elemMatch: { id: urlId } } };
	var query = {'urls.id': urlId};
	var projection = {'urls.$': 1};
	mongo.findOne('users', query, projection, function(err, result){
		if(err){
			response.status(500).end();
		}
		if(!result){
			response.status(404).end();
		}
		console.log(result);
		var urlDestino = result.urls[0].url;
		console.log(urlDestino);
		response.redirect(301, urlDestino);
	});
});

app.get('/users/:userId/stats', function(request, response){
	var query = {'id': request.params.userId};
	mongo.findOne('users', query, {}, function(err, result){
		if(err){
			response.status(500).end();
		}
		if(!result){
			response.status(404).end();
		}
		var stats = {};
		var urls = result.urls;
		stats.hits = urls.reduce(function(prev, current, index){
			return index == 1 ? prev.hits + current.hits : prev + current.hits;
		});
		stats.countUrls = urls.length;
		stats.topUrls = urls.sort(function(element1, element2){
			if(element1.hits > element2.hits){
				return -1;
			} else {
				return 1;
			}
			return 0;
		});
		response.status(200).json(stats);
	});
});

app.post('/users', function(request, response){
	var body = request.body;

	var user = {
		id : body.id
	}

	mongo.find('users', user, {}, function(err, docs){
		if(err){
			response.status(500).end();
		}
		if(docs.length > 0){
			response.sendStatus(409);
		}
		mongo.save('users', user, function(err, result){
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
		url.shortUrl = 'http://and.re/'

		var criteria = {id: request.params.userId};
		var update = {$push: {urls : url}}

		mongo.update('users', criteria, update, function(err, result){
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
		console.log(result);
		response.status(200).end();
	});
});

app.delete('/urls/:urlId', function(request, response){
	var urlId = request.params.urlId;
	var query = {
		'urls.id': urlId,

	}
	mongo.findAndModify('users', query, {}, function(err, result){
		console.log(result);
	});
});

app.get('/teste', function(req, res){
	res.redirect(301, 'https://www.google.de/?q=:query(Nyan+Cat)');
});

app.listen(3000, function(){
    console.log('Encurtador on na porta 3000');
});