let todoID = 0;
let allTodos = [];

// Function to retrieve todos from localStorage
function getTodosFromLocalStorage() {
    const todosJSON = localStorage.getItem('todos');
    return todosJSON ? JSON.parse(todosJSON) : [];
}

// Function to save todos to localStorage
function saveTodosToLocalStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Function to create a new todo element
function createTodoElement(id, text) {
    let trashEmoji = document.createElement('span')
    trashEmoji.onclick = () => deleteTodo(id);
    trashEmoji.classList.add('trash-emoji')
    trashEmoji.textContent = '🗑️'

    const todoElement = document.createElement('p');
    todoElement.classList.add('todo-element');
    todoElement.id = 'todo-element-' + id;
    todoElement.textContent = id + '. ' + text;
    todoElement.appendChild(trashEmoji)
    todoElement.onclick = () => markAsFinished(id);
    return todoElement;
}

// Function to add a new todo
function addNew() {
    todoID++;
    let lsTodos = getTodosFromLocalStorage();
    if(lsTodos.length !== 0){
        console.log('ran')
        todoID = lsTodos[lsTodos.length - 1].id
        todoID++
    }

    const todoList = document.querySelector('.todo-list');
    const newElement = document.createElement('div');
    const todoInput = document.createElement('input');
    todoInput.id = 'id-' + todoID;

    const createTodoButton = document.createElement('button');
    createTodoButton.classList.add('create-todo-button');
    createTodoButton.dataset.inputId = todoID;
    createTodoButton.textContent = 'ADD';

    todoInput.classList.add('todo-item');

    newElement.appendChild(todoInput);
    newElement.appendChild(createTodoButton);
    newElement.classList.add('todo-item');

    todoList.appendChild(newElement);

    createTodoButton.addEventListener('click', () => {
        const inputId = createTodoButton.dataset.inputId;
        const inputValue = document.getElementById('id-' + inputId).value;
        createTodoItem(inputId, inputValue);
    });
}

// Function to create a new todo item
function createTodoItem(id, text) {
    const stringValue = String(text);
    const inputElement = document.getElementById('id-' + id);
    const mainDiv = document.querySelector('.todo-list');

    const todoIndex = allTodos.findIndex(todo => todo.id === id);

     // If todo already exists, do nothing
    console.log('test')
    const button = document.querySelector('[data-input-id="' + id + '"]');
    const todoElement = createTodoElement(id, stringValue);

    if (inputElement) {
        inputElement.insertAdjacentElement('afterend', todoElement);
        inputElement.remove();
        button.remove();
    } else {
        mainDiv.appendChild(todoElement);
    }

    const todoToAdd = {
        text: stringValue,
        finished: false,
        id: id,
        date: Date.now()
    };

    if (todoIndex !== -1) return;
    allTodos.push(todoToAdd);
    saveTodosToLocalStorage(allTodos);
}

// Function to mark a todo as finished or unfinished
function markAsFinished(id) {
    const finished = document.getElementById('todo-element-' + id);
    const todoIndex = allTodos.findIndex(todo => todo.id === id);

    if (!finished || todoIndex === -1) return;

    if (finished.classList.contains('finished')) {
        finished.classList.remove('finished');
        allTodos[todoIndex].finished = false;
    } else {
        finished.classList.add('finished');
        allTodos[todoIndex].finished = true;
    }

    saveTodosToLocalStorage(allTodos);
}

// Function to load todos from localStorage and render them
function loadTodosFromLocalStorage() {
    allTodos = getTodosFromLocalStorage();
    console.log('Loaded todos:', allTodos);

    const todoList = document.querySelector('.todo-list');
    todoList.innerHTML = ''; // Clear the existing list before rendering

    allTodos.forEach(todo => {
        createTodoItem(todo.id, todo.text);
        if (todo.finished) {
            markAsFinished(todo.id);
        }
    });
    
}

//DELETE TODO
function deleteTodo(id) {
    let allTodos = getTodosFromLocalStorage();
    const indexToDelete = allTodos.findIndex(todo => todo.id == id);

    if (indexToDelete !== -1) {
        allTodos.splice(indexToDelete, 1);
        // Update the IDs of the remaining todos
        for (let i = indexToDelete; i < allTodos.length; i++) {
            allTodos[i].id--; // Decrement the IDs of todos after the deleted one
        }

        localStorage.setItem('todos', JSON.stringify(allTodos));

        const todoElement = document.getElementById('todo-element-' + id);
        if (todoElement) {
            todoElement.remove();
        }
        
        //TODO: Update global id so that the new todos start from the correct id
        loadTodosFromLocalStorage();
        console.log('Todo with ID ' + id + ' has been deleted.');
    } else {
        console.log('Todo with ID ' + id + ' not found.');
    }
}



// Event listener to call loadTodosFromLocalStorage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-new-button').addEventListener('click', addNew);
    loadTodosFromLocalStorage();
    addNew(); // Add new todo after loading todos from local storage
});
