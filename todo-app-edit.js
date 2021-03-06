//const { debug } = require("console");
// by Franklyn Roth https://codepen.io/franklynroth/pen/ZYeaBd
//const bootstrap = require(bootstrap');
const host = 'localhost';
const port = 3000;
let tarefaInput = document.getElementById("tarefa");//Add a new task.
let prazoInput = document.getElementById("prazo");
let responsavelInput = document.getElementById("responsavel");
let addButton = document.getElementById("adicionar");//first button
let incompleteTaskHolder = document.getElementById("incompletas");//ul of #incomplete-tasks
let completedTasksHolder = document.getElementById("completas");//completed-tasks
//typeof(taskRequest.responseText);

//New task list item 
let createNewTaskElement = function(tarefa, responsavel, prazo) {

	let listItem = document.createElement("li");
	let checkBox=document.createElement("input");//checkbx
    	checkBox.type="checkbox";
		checkBox.id="taskCheckbox";
		checkBox.classList.add("mx-2");
	let titleName = document.createElement("label");
		titleName.innerText = tarefa;
		titleName.classList.add("h4");
	let title = document.createElement("div");
		title.id = "title";
		title.classList.add("card-header");
		//title.classList.add("row");
	let data = document.createElement("ul");
		data.classList.add("list-group-flush");
	let labelResponsavel=document.createElement("li");//label
		labelResponsavel.innerText= "Responsável: "+ responsavel;
		labelResponsavel.id = "responsavel";
		labelResponsavel.classList.add("list-group-item");
	let labelPrazo=document.createElement("li");//label
        labelPrazo.innerText="Prazo: " + prazo;
		labelPrazo.id = "prazo";
		labelPrazo.classList.add("list-group-item");
	let editTarefaInput=document.createElement("input");//text
    	editTarefaInput.type="hidden";
		editTarefaInput.id="editTarefa";
	let editResponsavelInput=document.createElement("input");//text
    	editResponsavelInput.type="hidden";
		editResponsavelInput.id="editResponsavel";
	let editPrazoInput=document.createElement("input");//text
    	editPrazoInput.type="hidden";
		editPrazoInput.id="editPrazo";
    let editButton=document.createElement("button");//edit button
	    editButton.innerText="Editar";
	    editButton.className="edit";
		editButton.classList.add("btn");
		editButton.classList.add("btn-primary");
		editButton.classList.add("mx-1");	
	let deleteButton=document.createElement("button");//delete button
	    deleteButton.innerText="X";
	    deleteButton.className="delete";
		deleteButton.classList.add("btn");
		deleteButton.classList.add("btn-primary");
	deadLine(prazo);
	listItem.classList.add("card");
	listItem.classList.add("m-2");
	//and appending.
	title.appendChild(titleName);	
	title.appendChild(checkBox);
	listItem.appendChild(title);
	data.appendChild(labelResponsavel);
	data.appendChild(labelPrazo);
	data.appendChild(editTarefaInput);
	data.appendChild(editResponsavelInput);
	data.appendChild(editPrazoInput);
	data.appendChild(editButton);
	data.appendChild(deleteButton);
	listItem.appendChild(data);
	return listItem;
}

let addTask=function() {
	let listItem = createNewTaskElement(tarefaInput.value, responsavelInput.value, prazoInput.value);
	let JSONlistItem = serialize(listItem);
	postTarefas(JSONlistItem);
	incompleteTaskHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskCompleted);
}

let editTask=function() {
    let listItem=this.parentNode.parentNode;
	let antes = serialize(listItem);
	let depois = null;
	let JSONItens = [];
	let ulp=listItem.parentNode;
    let editTarefaInput=listItem.querySelector('input[id=editTarefa]');
	let editResponsavelInput=listItem.querySelector('input[id=editResponsavel]');
	let editPrazoInput=listItem.querySelector('input[id=editPrazo]');
    let ul=listItem.querySelector("ul"); 
	console.log(listItem);
    let containsClass=listItem.classList.contains("editMode");
	
		if(containsClass){
		    listItem.querySelector("div#title").querySelector("label").innerText = editTarefaInput.value;
			ul.querySelector("li#responsavel").innerHTML = "Responsável: ";
			ul.querySelector("li#responsavel").innerHTML += editResponsavelInput.value;
			ul.querySelector("li#prazo").innerHTML = "Prazo: ";
			ul.querySelector("li#prazo").innerHTML += editPrazoInput.value;
            editTarefaInput.value="";
			editTarefaInput.type = "hidden";
			editResponsavelInput.value="";
			editResponsavelInput.type = "hidden";
			editPrazoInput.value="";
			editPrazoInput.type = "hidden";
			depois = serialize(listItem);
			JSONItens.push(JSON.parse(antes));
			JSONItens.push(JSON.parse(depois));
			if (ulp === completedTasksHolder) {
				patchTarefaCompleta(JSON.stringify(JSONItens));
			}
			else if (ulp === incompleteTaskHolder){
				patchTarefa(JSON.stringify(JSONItens));
			}

			this.innerText = "Editar";
		}
        else {
			editTarefaInput.type = "text";
			editTarefaInput.value = listItem.querySelector("div#title").querySelector("label").innerText;
			editResponsavelInput.type = "text";
			editResponsavelInput.value = ul.querySelector("li#responsavel").innerHTML.replace("Responsável: ", "");
			editPrazoInput.type = "date";
			editPrazoInput.value = ul.querySelector("li#prazo").innerHTML.replace("Prazo: ", "");

			this.innerText = "Salvar";
		}
		listItem.classList.toggle("editMode");
}
//Delete task.
let deleteTask=function(){
		let listItem=this.parentNode.parentNode;
		let ul=listItem.parentNode;
		let JSONlistItem = serialize(listItem);
		if (ul === completedTasksHolder) {
			deleteCompleta(JSONlistItem);
		}
		else if (ul === incompleteTaskHolder){
			deleteIncompleta(JSONlistItem);
		}
		//Remove the parent list item from the ul.
		ul.removeChild(listItem);
}
//Mark task completed
let taskCompleted=function(){
	//Append the task list item to the #completed-tasks
	let listItem=this.parentNode.parentNode;
	completedTasksHolder.appendChild(listItem);
	let JSONlistItem = serialize(listItem);
	postCompletar(JSONlistItem);
    bindTaskEvents(listItem, taskIncomplete);
}
let taskIncomplete=function(){
    let listItem=this.parentNode.parentNode;
	incompleteTaskHolder.appendChild(listItem);
	let JSONlistItem = serialize(listItem);
	postDescompletar(JSONlistItem);
    bindTaskEvents(listItem,taskCompleted);
}
//identifies if the task is near deadline
let deadLine=function(taskDate){
 let currentDate = new Date();
 let auxiliarDate = taskDate;
 try{
 	if(currentDate.getYear() < (auxiliarDate[0] + auxiliarDate[1] + auxiliarDate[2] + auxiliarDate[3])){
		//console.log("o primeiro numero é do tipo ",	typeof(currentDate.getYear()), "o segundo numero é do tipo ", typeof(auxiliarDate[0] + auxiliarDate[1] + auxiliarDate[2] + auxiliarDate[3]));
	}else{
		//console.log(currentDate.getYear());
	}
 }catch(err){
	//console.log(err);
 }
}

let bindTaskEvents=function(taskListItem,taskstatus){
	//console.log("bind list item events");
    //select ListItems children
	let checkBox=taskListItem.querySelector("input[type=checkbox]");
	let editButton=taskListItem.querySelector("button.edit");
	let deleteButton=taskListItem.querySelector("button.delete");
	//Bind editTask to edit button.
	editButton.onclick=editTask;
	//Bind deleteTask to delete button.
	deleteButton.onclick=deleteTask;
	//Bind taskCompleted to checkBoxEventHandler.
	checkBox.onchange=taskstatus;
}

let serialize=function(listItem){
    let ul=listItem.querySelector("ul");
	jsontxt = {tarefa: listItem.querySelector("div#title").querySelector("label").innerText,
	        responsavel: ul.querySelector("li#responsavel").innerHTML.replace("Responsável: ", ""),
		    prazo: ul.querySelector("li#prazo").innerHTML.replace("Prazo: ", "")}
    return JSON.stringify(jsontxt);
}
//Request the incomplete tasks saved on the server
let getTarefas=function() {
	let taskRequest = new XMLHttpRequest();
	taskRequest.open('GET', `http://${host}:${port}/tarefas.json`);
	taskRequest.send();
	taskRequest.onload=function() {
		//console.log(taskRequest.responseText);
		lista = JSON.parse(taskRequest.responseText);
		for (var i=0; i<lista.length; ++i) {
			//console.log(lista[i]);
			newLI = createNewTaskElement(lista[i]['tarefa'], lista[i]['responsavel'], lista[i]['prazo']);
			incompleteTaskHolder.appendChild(newLI);
			bindTaskEvents(newLI, taskCompleted);
		}
	};	
}

//Request the completed tasks saved on the server
let getCompletedTarefas=function() {
	let taskRequest = new XMLHttpRequest();
	taskRequest.open('GET', `http://${host}:${port}/completas.json`);
	taskRequest.send();
	taskRequest.onload=function() {
		//console.log(taskRequest.responseText);
		lista = JSON.parse(taskRequest.responseText);
		for (var i=0; i<lista.length; ++i) {
			//console.log(lista[i]);
			newLI = createNewTaskElement(lista[i]['tarefa'], lista[i]['responsavel'], lista[i]['prazo']);
			newLI.querySelector("input[type=checkbox]").checked = "true";
			completedTasksHolder.appendChild(newLI);
			bindTaskEvents(newLI, taskIncomplete);
		}
	};	
}

let postTarefas=function(JSONlistItem){
	
	let taskRequest = new XMLHttpRequest();
	taskRequest.open('POST', `http://${host}:${port}/tarefas.json`);
	//taskRequest.setRequestHeader('string', 'tarefas.json');
	//console.log(JSONlistItem);
	//console.log(taskRequest);
	taskRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	taskRequest.send(JSONlistItem);
	taskRequest.onload=function(JSONlistItem) {
		if (taskRequest.status<200 || taskRequest.status>=400){
			console.log("deu bo")
		}
	}
}

let postTarefasCompletas=function(JSONlistItem){
	
	let taskRequest = new XMLHttpRequest();
	taskRequest.open('POST', `http://${host}:${port}/completas.json`);
	//taskRequest.setRequestHeader('string', 'tarefas.json');
	//console.log(JSONlistItem);
	//console.log(taskRequest);
	taskRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	taskRequest.send(JSONlistItem);
	taskRequest.onload=function(JSONlistItem) {
		if (taskRequest.status<200 || taskRequest.status>=400){
			console.log("deu bo")
		}
	}
}

let postCompletar=function(JSONlistItem){
	let taskRequest = new XMLHttpRequest();
	taskRequest.open('POST', `http://${host}:${port}/completar`);
	//taskRequest.setRequestHeader('string', 'tarefas.json');
	//console.log(JSONlistItem);
	//console.log(taskRequest);
	taskRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	taskRequest.send(JSONlistItem);
	taskRequest.onload=function(JSONlistItem) {
		if (taskRequest.status<200 || taskRequest.status>=400){
			console.log("deu bo")
		}
	}
}

let postDescompletar=function(JSONlistItem){
	let taskRequest = new XMLHttpRequest();
	taskRequest.open('POST', `http://${host}:${port}/descompletar`);
	//taskRequest.setRequestHeader('string', 'tarefas.json');
	//console.log(JSONlistItem);
	//console.log(taskRequest);
	taskRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	taskRequest.send(JSONlistItem);
	taskRequest.onload=function(JSONlistItem) {
		if (taskRequest.status<200 || taskRequest.status>=400){
			console.log("deu bo")
		}
	}
}

let deleteIncompleta=function(JSONlistItem){
	let taskRequest = new XMLHttpRequest();
	taskRequest.open('DELETE', `http://${host}:${port}/delete-incompleta`);
	//taskRequest.setRequestHeader('string', 'tarefas.json');
	//console.log(JSONlistItem);
	//console.log(taskRequest);
	taskRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	taskRequest.send(JSONlistItem);
	taskRequest.onload=function(JSONlistItem) {
		if (taskRequest.status<200 || taskRequest.status>=400){
			console.log("deu bo")
		}
	}
}

let deleteCompleta=function(JSONlistItem){
	let taskRequest = new XMLHttpRequest();
	taskRequest.open('DELETE', `http://${host}:${port}/delete-completa`);
	//taskRequest.setRequestHeader('string', 'tarefas.json');
	//console.log(JSONlistItem);
	//console.log(taskRequest);
	taskRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	taskRequest.send(JSONlistItem);
	taskRequest.onload=function(JSONlistItem) {
		if (taskRequest.status<200 || taskRequest.status>=400){
			console.log("deu bo")
		}
	}
}

let patchTarefa=function(JSONlistItem){
	let taskRequest = new XMLHttpRequest();
	taskRequest.open('PATCH', `http://${host}:${port}/patch-incompleta`);
	//taskRequest.setRequestHeader('string', 'tarefas.json');
	//console.log(JSONlistItem);
	//console.log(taskRequest);
	taskRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	taskRequest.send(JSONlistItem);
	taskRequest.onload=function(JSONlistItem) {
		if (taskRequest.status<200 || taskRequest.status>=400){
			console.log("deu bo")
		}
	}
}

let patchTarefaCompleta=function(JSONlistItem){
	let taskRequest = new XMLHttpRequest();
	taskRequest.open('PATCH', `http://${host}:${port}/patch-completa`);
	//taskRequest.setRequestHeader('string', 'tarefas.json');
	//console.log(JSONlistItem);
	//console.log(taskRequest);
	taskRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	taskRequest.send(JSONlistItem);
	taskRequest.onload=function(JSONlistItem) {
		if (taskRequest.status<200 || taskRequest.status>=400){
			console.log("deu bo")
		}
	}
}

//addButton.onclick=addTask;
addButton.addEventListener("click",addTask);
//cycle over incompleteTaskHolder ul list items
for (let i=0; i<incompleteTaskHolder.children.length;i++){
    //bind events to list items chldren(tasksCompleted)
    bindTaskEvents(incompleteTaskHolder.children[i],taskCompleted);
}
//cycle over completedTasksHolder ul list items
for (let i=0; i<completedTasksHolder.children.length;i++){
	//bind events to list items chldren(tasksIncompleted)
    bindTaskEvents(completedTasksHolder.children[i],taskIncomplete);
}

getTarefas();
getCompletedTarefas();
