var app = require('express')();
var bodyParser = require('body-parser');
var mongo = require('./db/mongoConnection.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/urls/:id', function(request, response){
    //recuperar url
    //resposta:
    //response.location('');
    //response.status(301).end();
});

app.post('/users', function(request, response){
	var body = request.body;

	var user = {
		id : body.id
	}

	mongo.find('users', user, function(err, docs){
		if(err){
			response.status(500).send('Erro interno');
		}
		if(docs.length > 0){
			response.sendStatus(409);
		}
		mongo.save('users', user, function(err, result){
	        if(err){
	            response.status(500).send('Erro interno');
	        }
	        response.status(201).json(user);
	    });
	});
});

app.post('/users/:userId/urls', function(request, response){

	mongo.findAndModify('counters', {_id: 'urlsId'}, {$inc: {seq : 1}}, function(err, result){
		if(err){
			response.status(500).send('Erro interno');
		}
		var body = request.body;
		var url = {};
		url.id = result.value.seq;
		url.hints = 0;
		url.url = request.body.url;
		url.shortUrl = 'http://nariz.ptr/ASDfeiBa'

		var criteria = {id: request.params.userId};
		var update = { $push: {urls : url}}

		mongo.update('users', criteria, update, function(err, result){
			if(err){
				response.status(500).send('Erro interno');
			}
			response.status(201).json(url);
		});
	});
});

app.listen(3000, function(){
    console.log('Encurtador on na porta 3000');
});