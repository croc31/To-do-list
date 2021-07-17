// by Franklyn Roth https://codepen.io/franklynroth/pen/ZYeaBd
let taskInput = document.getElementById("new-task");//Add a new task.
let addButton = document.getElementsByTagName("button")[0];//first button
let incompleteTaskHolder = document.getElementById("incomplete-tasks");//ul of #incomplete-tasks
let completedTasksHolder = document.getElementById("completed-tasks");//completed-tasks

//New task list item
let createNewTaskElement = function(taskString) {

	let listItem = document.createElement("li");
	let checkBox=document.createElement("input");//checkbx
    	checkBox.type="checkbox";
	let label=document.createElement("label");//label
        label.innerText=taskString;
	let editInput=document.createElement("input");//text
    	editInput.type="text";
    let editButton=document.createElement("button");//edit button
	    editButton.innerText="Editar";
	    editButton.className="edit";	
	let deleteButton=document.createElement("button");//delete button
	    deleteButton.innerText="X";
	    deleteButton.className="delete";

	//and appending.
	listItem.appendChild(checkBox);
	listItem.appendChild(label);
	listItem.appendChild(editInput);
	listItem.appendChild(editButton);
	listItem.appendChild(deleteButton);
	return listItem;
}

let addTask=function() {
	console.log("Add Task...");
	//Create a new list item with the text from the #new-task:
	let listItem=createNewTaskElement(taskInput.value);
	//Append listItem to incompleteTaskHolder
	incompleteTaskHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskCompleted);
	taskInput.value="digite aqui";
}

//Edit an existing task.
let editTask=function() {
    let listItem=this.parentNode;
    let editInput=listItem.querySelector('input[type=text]');
    let label=listItem.querySelector("label");
    let containsClass=listItem.classList.contains("editMode");
		//If class of the parent is .editmode
		if(containsClass){
		//switch to .editmode
		//label becomes the inputs value.
			label.innerText=editInput.value;
            editInput.value="";
		}
        else {
            label.innerText="";
			editInput.value=label.innerText;
		}
		//toggle .editmode on the parent.
		listItem.classList.toggle("editMode");
}
//Delete task.
let deleteTask=function(){
		let listItem=this.parentNode;
		let ul=listItem.parentNode;
		//Remove the parent list item from the ul.
		ul.removeChild(listItem);
}
//Mark task completed
let taskCompleted=function(){
	//Append the task list item to the #completed-tasks
	let listItem=this.parentNode;
	completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);
}
let taskIncomplete=function(){
    //Mark task as incomplete, when the checkbox is unchecked
    //Append the task list item to the #incomplete-tasks.
    let listItem=this.parentNode;
	incompleteTaskHolder.appendChild(listItem);
    bindTaskEvents(listItem,taskCompleted);
}

let bindTaskEvents=function(taskListItem,taskstatus){
	console.log("bind list item events");
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

