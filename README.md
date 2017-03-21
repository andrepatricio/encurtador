Descrição:
    -Um encurtador de URL é um serviço que recebe uma URL qualquer e retorna uma outra, geralmente

    menor que a original. Ex: bit.ly, TinyURL.

Dependencias: 
 - Nodejs v5.12.0
 - MongoDB v2.6.12

 Instruções para rodar:
 - No mongodb criar as collections utilizando os seguintes comandos: 
    db.createCollection('users');

    db.createCollection('counters');

- Inserir o contador que serve para gerar o id sequencial das urls:
    db.counters.insert({ "_id" : "urlsId", "seq" : 1 });

- Entrar na pasta do projeto e rodar o arquivo app.js no node passando a url do banco como argumento comando:
    node app.js <url-mongo>