import "./styles.css";
import * as updatePage from "./page";
import { saveTasksToLocal, loadTasksFromLocal } from "./localStorage";

let tasks = [];
let categories = [];

class Task {
  constructor(title, description, dueDate, category) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.category = category;
  }
}

class Category {
  constructor(name, emoji) {
    this.name = name;
    this.emoji = emoji;
  }
}

// Main content div
const content = document.getElementById('content');


const defaultCategory = new Category(
  '',
  ''
);

window.onload = function() {
  // When title is clicked, select all in the field
  const titleInput = document.querySelector('input[name=title]');
  titleInput.addEventListener('click', () => {
    titleInput.select();
  })

  // New task button listener
  const newTaskButton = document.getElementById('new-task-button');
  newTaskButton.addEventListener('click', createNewTask);

  // Listen for new task clicks, prevent form submission
  const form = document.getElementById('task-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    createNewTask();
  })

  // Load tasks from local storage
  tasks = loadTasksFromLocal();

  // Populate tasks on the page
  tasks.forEach(task => {
    updatePage.generateTaskMarkup(task);
  });

  // generateTestData();

  // Populate dropdown
  updatePage.generateCategoriesDropdownMarkup(categories);

  // Populate menu
  updatePage.generateCategoriesMenu(categories);

  // Add listener for Add category
  const addButton = document.getElementById('add-category-button');
  addButton.addEventListener('click', addNewCategory);
}

// Creates new category, adds it to categories array, closes the modal
function addNewCategory() {
  // Get values from the form
  const emoji = document.getElementById('category-emoji-button').innerText;
  let name = document.querySelector('input[name="name"]').value;

  // Capitalize the name
  name = name.charAt(0).toUpperCase() + name.slice(1);

  // Create new category
  const category = new Category (
    name,
    emoji
  );

  // Push to array
  categories.push(category);

  // Update the sidebar
  updatePage.generateCategoriesMenu(categories);

  // Update the dropdown
  updatePage.generateCategoriesDropdownMarkup(categories);

  // Close this modal
  updatePage.closeModal('add-category-modal');
}

function createNewTask() {
  // Get values from the form
  const form = document.getElementById('task-form');
  
  const titleInput = document.querySelector('input[name=title]');
  const dueDate = document.querySelector('input[name=due-date]').value;
  const category = document.querySelector('select[name=category]').value ;

  // Create new object
  let task = new Task(
    titleInput.value,
    '',
    category,
    dueDate
  );

  // Add to array
  tasks.push(task);

  // Generate markup
  updatePage.generateTaskMarkup(task);

  // Clear the form
  titleInput.value = '';
  titleInput.focus();

  // Save tasks to local storage
  saveTasksToLocal(tasks);
}

function generateTestData() {

  let task1 = new Task(
    "finish writing this class",
    "put updatePage in it like title, desc, due date, status",
    "2024-10-15"
  );
  let task2 = new Task(
    "Second task",
    "Some other stuff: title, desc, due date, status",
    "2024-10-15"
  );
  
  tasks.push(task1);
  tasks.push(task2);


  updatePage.generateTaskMarkup(task1);
  // generateTaskMarkup(task2);

  let cat1 = new Category(
    "Sport",
    "🤾"
  );
  let cat2 = new Category(
    "Programming",
    "💻"
  );
  categories.push(cat1, cat2);
}
