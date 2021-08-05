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
    try {
        if (fs.existsSync('tarefas.json')) {
          //file exists
          if(fs.readFileSync('tarefas.json').length === 0){
            fs.appendFileSync('tarefas.json', '[]');
          }
        }
    } 
    catch(err) {
        console.log(err);
        fs.appendFile('tarefas.json', '[]', function(err) {
            if (err) return console.log(err);
        });
    }

    fs.readFile('tarefas.json', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        response.send(data.toString());
    });
})

app.get('/completas.json', function(request, response){
    try {
        if (fs.existsSync('completas.json')) {
          //file exists
          if(fs.readFileSync('completas.json').length === 0){
            fs.appendFileSync('completas.json', '[]');
          }
        }
    } 
    catch(err) {
        fs.appendFile('completas.json', '[]', function(err) {
            if (err) return console.log(err);
        });
    }
    fs.readFile('completas.json', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        response.send(data.toString());
    });
})
// app.get('/tarefas.json', function(request, response){
//     fs.appendFile('tarefas.json', '', function(err) {
//         if (err) return console.log(err);
//     });
//     response.sendFile(path.join(__dirname, 'tarefas.json'));
// })
app.use(express.json());

app.post('/tarefas.json', function(request, response) {

    // fs.appendFile('tarefas.json', JSON.stringify(request.body), function(err) {
    //     if (err) return console.log(err);
    //    // localStorage.setItem('tarefas.json', request.body);
        
    // });
    //let wstream = fs.WriteStream('tarefas.json');
    let incompletas = JSON.parse(fs.readFileSync('tarefas.json', 'utf8'));
    incompletas.push(request.body);
    fs.writeFileSync('tarefas.json', JSON.stringify(incompletas));
    console.log(request.body);
})

app.post('/completas.json', function(request, response) {

    // fs.appendFile('tarefas.json', JSON.stringify(request.body), function(err) {
    //     if (err) return console.log(err);
    //    // localStorage.setItem('tarefas.json', request.body);
        
    // });
    //let wstream = fs.WriteStream('tarefas.json');
    let completas = JSON.parse(fs.readFileSync('completas.json', 'utf8'));
    completas.push(request.body);
    fs.writeFileSync('completas.json', JSON.stringify(completas));
    console.log(request.body);
})

app.post('/completar', function(request, response) {
    let incompletas = JSON.parse(fs.readFileSync('tarefas.json', 'utf8'));
    let completas = JSON.parse(fs.readFileSync('completas.json', 'utf8'));
    let index = incompletas.findIndex(function(item){
        return item === request.body
    });
    incompletas.splice(index, 1);
    completas.push(request.body);
    fs.writeFileSync('completas.json', JSON.stringify(completas));
    fs.writeFileSync('tarefas.json', JSON.stringify(incompletas));
})

app.post('/descompletar', function(request, response) {
    let incompletas = JSON.parse(fs.readFileSync('tarefas.json', 'utf8'));
    let completas = JSON.parse(fs.readFileSync('completas.json', 'utf8'));
    let index = completas.findIndex(function(item){
        //console.log(item);
        //console.log("------------------------------")
        //console.log(request.body);
        return item === request.body
    });
    console.log()
    completas.splice(index, 1);
    incompletas.push(request.body);
    fs.writeFileSync('completas.json', JSON.stringify(completas));
    fs.writeFileSync('tarefas.json', JSON.stringify(incompletas));
})

app.delete('/delete-incompleta', function(request, response) {
    let incompletas = JSON.parse(fs.readFileSync('tarefas.json', 'utf8'));
    let index = incompletas.findIndex(function(item){
        return item === request.body
    });
    incompletas.splice(index, 1);
    fs.writeFileSync('tarefas.json', JSON.stringify(incompletas));
})

app.delete('/delete-completa', function(request, response) {
    let completas = JSON.parse(fs.readFileSync('completas.json', 'utf8'));
    let index = completas.findIndex(function(item){
        return item === request.body
    });
    completas.splice(index, 1);
    fs.writeFileSync('completas.json', JSON.stringify(completas));
})

app.listen(port, () => {
  console.log(`Servidor: http://localhost:${port}`);
})
