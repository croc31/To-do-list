const config = require('./config.json')
const fs = require('fs');
const _ = require('lodash')
const express = require('express')
const path = require('path')
const app = express()
const port = config.url.port

let frontScript = fs.readFileSync('todo-app-edit.js', {encoding:'utf8', flag:'r'});
frontScript = frontScript.replace(/.*const host =.*/g, 'const host = \'' + config.url.hostname + '\';');
frontScript = frontScript.replace(/.*const port =.*/g, 'const port = ' + config.url.port + ';');
fs.writeFileSync('todo-app-edit.js', frontScript);

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'ToDoApp2021-edit.html'));
})

app.get('/todo', function(request, response){
    response.sendFile(path.join(__dirname, 'ToDoApp2021-edit.html'));
})

app.get('/todo-app-edit.js', function(request, response){
    response.sendFile(path.join(__dirname, 'todo-app-edit.js'));
})

app.get('/config.json', function(request, response){
    response.sendFile(path.join(__dirname, 'config.json'));
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

app.use(express.json());

app.post('/tarefas.json', function(request, response) {
    let incompletas = JSON.parse(fs.readFileSync('tarefas.json', 'utf8'));
    incompletas.push(request.body);
    fs.writeFileSync('tarefas.json', JSON.stringify(incompletas));
    console.log(request.body);
})

app.post('/completas.json', function(request, response) {
    let completas = JSON.parse(fs.readFileSync('completas.json', 'utf8'));
    completas.push(request.body);
    fs.writeFileSync('completas.json', JSON.stringify(completas));
    console.log(request.body);
})

app.post('/completar', function(request, response) {
    let incompletas = JSON.parse(fs.readFileSync('tarefas.json', 'utf8'));
    let completas = JSON.parse(fs.readFileSync('completas.json', 'utf8'));
    let index = incompletas.findIndex(function(item){
        return _.isEqual(item, request.body);
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
        return _.isEqual(item, request.body);
    });
    completas.splice(index, 1);
    incompletas.push(request.body);
    fs.writeFileSync('completas.json', JSON.stringify(completas));
    fs.writeFileSync('tarefas.json', JSON.stringify(incompletas));
})

app.delete('/delete-incompleta', function(request, response) {
    let incompletas = JSON.parse(fs.readFileSync('tarefas.json', 'utf8'));
    let index = incompletas.findIndex(function(item){
        return _.isEqual(item, request.body);
    });
    incompletas.splice(index, 1);
    fs.writeFileSync('tarefas.json', JSON.stringify(incompletas));
})

app.delete('/delete-completa', function(request, response) {
    let completas = JSON.parse(fs.readFileSync('completas.json', 'utf8'));
    let index = completas.findIndex(function(item){
        return _.isEqual(item, request.body);
    });
    completas.splice(index, 1);
    fs.writeFileSync('completas.json', JSON.stringify(completas));
})

app.patch('/patch-incompleta', function(request, response) {
    let incompletas = JSON.parse(fs.readFileSync('tarefas.json', 'utf8'));
    let index = incompletas.findIndex(function(item){
        return _.isEqual(item, request.body[0]);
    });
    incompletas[index] = request.body[1];
    fs.writeFileSync('tarefas.json', JSON.stringify(incompletas));
})

app.patch('/patch-completa', function(request, response) {
    let completas = JSON.parse(fs.readFileSync('completas.json', 'utf8'));
    let index = completas.findIndex(function(item){
        return _.isEqual(item, request.body[0]);
    });
    completas[index] = request.body[1];
    fs.writeFileSync('completas.json', JSON.stringify(completas));
})

app.listen(port, () => {
  console.log(`Servidor: http://${config.url.hostname}:${port}`);
})
