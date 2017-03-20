var app = require('express')();
var bodyParser = require('body-parser');
var mongo = require('./db/mongoConnection.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/urls/:id', function(request, response){
	var urlId = request.params.id;
	var query = {'urls.id': urlId};
	var projection = {'urls.$': 1};
	mongo.find('users', query, projection, function(err, result){
		if(err){
			response.status(500).end();
		}
		var urlDestino = result[0].urls[0].url;
		console.log(urlDestino);
		response.redirect(301, urlDestino);
	});
});

app.get('/stats/:id', function(request, response){
	var query = {'urls.id': request.params.id};
	mongo.findOne('users', query, {'urls.$': 1}, function(err, result){
		if(err){
			response.status(500).end();
		}
		response.status(200).json(result.urls.pop());
	});
});

app.get('/stats', function(request, response){

});

app.get('/users/:userId/stats', function(request, response){
	var query = {'id': request.params.userId};
	mongo.findOne('users', query, {}, function(err, result){
		if(err){
			response.status(500).end();
		}
		var urls = result.urls;
		var stats = {};
		stats.urlCount = urls.length;
		stats.hints = {};
		stats.topUrls = urls.sort(function(a, b){
			return a.hints < b.hints ? -1 : 1;
		});
		console.log(stats);
		response.status(200).end();
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
		url.hints = 13;
		url.url = request.body.url;
		url.shortUrl = 'http://and.re/'

		var criteria = {id: request.params.userId};
		var update = { $push: {urls : url}}

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
	mongo.findOne('users', {'urls.id': request.params.urlId}, {'id' : 1, 'urls.$': 1}, function(err, result){
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