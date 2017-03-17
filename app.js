var app = require('express')();

app.get('/urls/:id', function(request, response){
    //recuperar url
    //resposta:
    //response.location('');
    //response.status(301).end();
});

app.post('/users', function(request, response){
    //salvar o usuario
});

app.listen(3000, function(){
    console.log('Encurtador on na porta 3000');
});