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

app.listen(3000, function(){
    console.log('Encurtador on na porta 3000');
});