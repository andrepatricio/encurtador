Descrição:
    -Um encurtador de URL é um serviço que recebe uma URL qualquer e retorna uma outra, geralmente

    menor que a original. Ex: bit.ly, TinyURL.

Dependencias: 
 - Nodejs v5.12.0
 - NPM v3.8.6
 - MongoDB v2.6.12

 Instruções para rodar:
 - No mongodb criar as collections utilizando os seguintes comandos: 
    db.createCollection('users');

    db.createCollection('counters');

- Inserir o contador que serve para gerar o id sequencial das urls:
    db.counters.insert({ "_id" : "urlsId", "seq" : 1 });

- Na pasta do projeto baixar as dependencias do npm com o seguinte comando:
    npm install

- Na pasta do projeto rodar o arquivo app.js no node passando a url do banco como argumento:
    node app.js <url-mongo>
    Exemplo: node app.js mongodb://localhost:27017/encurtador_test