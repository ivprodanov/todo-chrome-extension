let todoID = 0;
let allTodos = [];

// Function to retrieve todos from localStorage
function getTodosFromLocalStorage() {
  const todosJSON = localStorage.getItem("todos");
  return todosJSON ? JSON.parse(todosJSON) : [];
}

// Function to save todos to localStorage
function saveTodosToLocalStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Function to create a new todo element
function createTodoElement(id, text) {
  let lsTodos = getTodosFromLocalStorage();

  let editSpansContainer = document.createElement('div')
  let checkMark = document.createElement('span')
  let trashEmoji = document.createElement("span");
  trashEmoji.onclick = () => deleteTodo(id);
  trashEmoji.classList.add("trash-emoji");
  checkMark.classList.add("check-todo");
  checkMark.textContent = '✔'
  trashEmoji.textContent = "❌";
  editSpansContainer.appendChild(checkMark)
  editSpansContainer.appendChild(trashEmoji)

  let colorSpan = document.createElement('span')
  colorSpan.classList.add('color-chooser-span')
  colorSpan.id = 'todo-color-' + id;
  colorSpan.style.display = 'none'
  colorSpan.style.padding = '10px'

  let colorsDiv = document.createElement('div')
  colorsDiv.classList.add('colors-container')
  let redSpan = document.createElement('span')
  redSpan.classList.add('color-span', 'red')
  redSpan.id = `red-${id}`
  let purpleSpan = document.createElement('span')
  purpleSpan.classList.add('color-span', 'purple')
  purpleSpan.id = `purple-${id}`
  let yellowSpan = document.createElement('span')
  yellowSpan.classList.add('color-span', 'yellow')
  yellowSpan.id = `yellow-${id}`
  let cyanSpan = document.createElement('span')
  cyanSpan.classList.add('color-span', 'cyan')
  cyanSpan.id = `cyan-${id}`
  
  colorsDiv.appendChild(redSpan)
  colorsDiv.appendChild(purpleSpan)
  colorsDiv.appendChild(yellowSpan)
  colorsDiv.appendChild(cyanSpan)
  colorSpan.appendChild(colorsDiv)

  const todoElement = document.createElement("p");
  let colorToAdd = lsTodos.find(todo => todo.id == id)
  if(colorToAdd) {
    colorToAdd = colorToAdd.color
    if(colorToAdd) {
      todoElement.classList.add(colorToAdd);
    }
  }
  todoElement.classList.add("todo-element");
  
  todoElement.id = "todo-element-" + id;
  let todoText = document.createElement('span')
  todoText.classList.add('todo-text')
  todoText.textContent = id + ". " + text;
  todoElement.appendChild(todoText)
  todoElement.appendChild(colorSpan);
  todoElement.appendChild(editSpansContainer);
  checkMark.onclick = () => markAsFinished(id);
  todoElement.onclick = () => chooseColor(id);
  return todoElement;
}

// Function to add a new todo
function addNew() {
  todoID++;
  let lsTodos = getTodosFromLocalStorage();
  if (lsTodos.length !== 0) {
    todoID = lsTodos[lsTodos.length - 1].id;
    todoID++;
  }
  const inputValue = document.getElementById("todo-input").value;
  createTodoItem(todoID, inputValue);

  const placeholderText = document.querySelector('.todo-list > .empty-text');
  if (placeholderText) {
    placeholderText.remove();
  }
}

// Function to create a new todo item
function createTodoItem(id, text) {
  const stringValue = String(text);
  const inputElement = document.getElementById("id-" + id);
  const mainDiv = document.querySelector(".todo-list");

  const todoIndex = allTodos.findIndex((todo) => todo.id === id);

  // If todo already exists, do nothing
  const button = document.querySelector('[data-input-id="' + id + '"]');
  const todoElement = createTodoElement(id, stringValue);

  if (inputElement) {
    inputElement.insertAdjacentElement("afterend", todoElement);
    inputElement.remove();
    button.remove();
  } else {
    mainDiv.appendChild(todoElement);
  }

  const todoToAdd = {
    text: stringValue,
    finished: false,
    id: id,
    color: '',
    date: Date.now(),
  };

  if (todoIndex !== -1) return;
  allTodos.push(todoToAdd);
  saveTodosToLocalStorage(allTodos);
}

function chooseColor(id){
  let chosenTodoItem = document.getElementById(`todo-color-${id}`)
  if (chosenTodoItem.style.display !== "block") {
    chosenTodoItem.style.display = "block";
  } else {
    chosenTodoItem.style.display = "none";
  }

  chosenTodoItem.style.height = '30px'
  chosenTodoItem.style.backgroundColor = '#333'
  chosenTodoItem.style.borderRadius = '10px'
  // chosenTodoItem.style.marginTop = '35px'

  const colorSpans = document.querySelectorAll(".color-span");
  colorSpans.forEach((span) => {
    const id = span.id.split("-")[1]; // Extract todo ID from span ID
    const color = span.classList[1]; // Extract color from class list
    span.addEventListener("click", () => chooseColorForTodoItem(id, color));
  });
}

function chooseColorForTodoItem(id, color) {
  
  const chosenTodoItem = document.getElementById(`todo-element-${id}`);
  if (!chosenTodoItem) return; // Return if todo item not found
  
  // Remove existing color classes
  chosenTodoItem.classList.remove("red", "purple", "yellow", "cyan");
  
  // Set new color class
  chosenTodoItem.classList.add(color);
  
  // Update color property in allTodos array
  const todoIndex = allTodos.findIndex((todo) => todo.id == id);
  if (todoIndex !== -1) {
    allTodos[todoIndex].color = color; // Update color property directly
    saveTodosToLocalStorage(allTodos);
  }
}


// Function to mark a todo as finished or unfinished
function markAsFinished(id) {
  const finished = document.getElementById("todo-element-" + id);
  const todoIndex = allTodos.findIndex((todo) => todo.id === id);

  if (!finished || todoIndex === -1) return;

  if (finished.classList.contains("finished")) {
    finished.classList.remove("finished");
    allTodos[todoIndex].finished = false;
  } else {
    finished.classList.add("finished");
    allTodos[todoIndex].finished = true;
  }

  saveTodosToLocalStorage(allTodos);
}

// Function to load todos from localStorage and render them
function loadTodosFromLocalStorage() {
  allTodos = getTodosFromLocalStorage();

  const todoList = document.querySelector(".todo-list");
  todoList.innerHTML = ""; // Clear the existing list before rendering

  if(allTodos.length == 0) {
    let text = document.createElement('p');
    text.classList.add('empty-text')
    text.id = 'empty-text'
    text.textContent = 'Your todos will appear here..';
    todoList.appendChild(text); // Append the text to the todoList element
  }

  allTodos.forEach((todo) => {
    createTodoItem(todo.id, todo.text);
    if (todo.finished) {
      markAsFinished(todo.id);
    }
  });
}

//DELETE TODO
function deleteTodo(id) {
  let allTodos = getTodosFromLocalStorage();
  const indexToDelete = allTodos.findIndex((todo) => todo.id == id);

  if (indexToDelete !== -1) {
    allTodos.splice(indexToDelete, 1);
    // Update the IDs of the remaining todos
    for (let i = indexToDelete; i < allTodos.length; i++) {
      allTodos[i].id--; // Decrement the IDs of todos after the deleted one
    }

    localStorage.setItem("todos", JSON.stringify(allTodos));

    const todoElement = document.getElementById("todo-element-" + id);
    if (todoElement) {
      todoElement.remove();
    }

    if (allTodos.length === 0) {
        // Reset todoID when all todos are deleted
        todoID = 0; // or todoID = 1; if you want to start from 1
      }

    //TODO: Update global id so that the new todos start from the correct id
    loadTodosFromLocalStorage();
    console.log("Todo with ID " + id + " has been deleted.");
  } else {
    console.log("Todo with ID " + id + " not found.");
  }
}

// Event listener to call loadTodosFromLocalStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("add-new-button").addEventListener("click", addNew);
  loadTodosFromLocalStorage();
//   addNew(); // Add new todo after loading todos from local storage
});
