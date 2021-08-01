/*
var http = require('http');
var fs = require('fs');
var url = require('url');

// Cria o servidor
http.createServer( function (request, response) {  
   // Analisa a requisição com o nome do arquivo
   var pathname = url.parse(request.url).pathname;
   
   // Mensagem de log com o nome do arquivo
   console.log("Request for " + pathname + " received.");
   
   // Utiliza o módulo fs para obter o arquivo solicitado
   fs.readFile(pathname.substr(1), function (err, data) {
      if (err) {
         console.log(err);      
         response.writeHead(404, {'Content-Type': 'text/html'});
      } else {	
         response.writeHead(200, {
             'Content-Type': 'text/html',
             'Access-Control-Allow-Origin':'*'
         });	
         // Conteúdo do arquivo 
         response.write(data.toString());		
      }
      // Envia a resposta 
      response.end();
   });   
}).listen(8081);
// Mensagem para indicar o início do servidor
console.log('Servidor rodando em localhost:8081/...');
*/

const fs = require('fs');
const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'ToDoApp2021-edit.html'));
})

app.get('/todo', function(request, response){
    response.sendFile(path.join(__dirname, 'ToDoApp2021-edit.html'));
})

app.get('/todo-app-edit.js', function(request, response){
    response.sendFile(path.join(__dirname, 'todo-app-edit.js'));
})

app.get('/tarefas.json', function(request, response){
    fs.appendFile('tarefas.json', '', function(err) {
        if (err) return console.log(err);
    });
    response.sendFile(path.join(__dirname, 'tarefas.json'));
})

app.post('/tarefas.json', function(request, response) {
    fs.appendFile('tarefas.json', request.body, function(err) {
        if (err) return console.log(err);
    })
    
})

app.listen(port, () => {
  console.log(`Servidor: http://localhost:${port}`)
})
