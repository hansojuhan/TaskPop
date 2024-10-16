import "./styles.css";
import * as updatePage from "./page";
import { saveTasksToLocal, loadTasksFromLocal, saveCategoriesToLocal, loadCategoriesFromLocal } from "./localStorage";

let tasks = [];
let categories = [];

class Task {
  constructor(id, title, dueDate, category) {
    this.id = id; // Unique ID
    this.title = title;
    // this.description = description;
    this.dueDate = dueDate;
    this.category = category;
    this.isDone = false;
  }
}

class Category {
  constructor(id, name, emoji) {
    this.id = id;
    this.name = name;
    this.emoji = emoji;
  }
}

// Main content div
const content = document.getElementById('content');

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
  console.log(tasks);
  
  // Show all categories by default
  showAllCategories();

  // Load categories from local storage
  // generateTestData();
  categories = loadCategoriesFromLocal();
  console.log(categories);

  // Populate categories on page, in dropdowns and in menu
  updatePage.generateCategoriesMenu(categories);
  updatePage.generateCategoriesDropdownMarkup(categories);
}

// Creates new category, adds it to categories array, closes the modal
export function addNewCategory() {
  // Get values from the form
  const emoji = document.getElementById('category-emoji-button').innerText;
  let name = document.querySelector('input[name="name"]').value;

  // Capitalize the name
  name = name.charAt(0).toUpperCase() + name.slice(1);

  const id = Date.now();

  // Create new category
  const category = new Category (
    id,
    name,
    emoji
  );

  // Push to array
  categories.push(category);

  // Update local storage
  saveCategoriesToLocal(categories);

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
  const category = document.querySelector('select[name=category]').value;

  // Use current time as unique ID
  const id = Date.now();

  // Create new object
  let task = new Task(
    id,
    titleInput.value,
    dueDate,
    category
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

// Updates task status on click
export function updateTaskStatus(event) {
  const checkbox = event.target;
  const taskId = checkbox.getAttribute('data-id');

  // t.id === taskId will give false, since === also checks the type
  // t.id is a number, taskId is a string
  // Solution 1: use ==, which does the conversions by itself
  // Solution 2: use === Number(taskId) to convert to number
  const task = tasks.find(t => t.id == taskId);
  
  if (task) {
    task.isDone = checkbox.checked;
    console.log(`Task "${task.title}" updated. Completed: ${task.isDone}`);

    // Update local storage
    saveTasksToLocal(tasks);
  }
}

export function showCategory(category) {
  // Filter tasks of a project
  const categoryTasks = tasks.filter(t => t.category == category.id);

  // Populate tasks on the page
  updatePage.regenerateAllTasksMarkup(categoryTasks);

  // Update page header
  updatePage.updatePageHeader(`${category.emoji} ${category.name}`);
}

export function showAllCategories() {
  // Populate tasks on the page
  updatePage.regenerateAllTasksMarkup(tasks);

  // Update page header
  updatePage.updatePageHeader('Todo');
}

export function editCategory(categoryId) {
  // Get values from the form
  const newEmoji = document.getElementById('category-emoji-button').innerText;
  let newName = document.querySelector('input[name="name"]').value;

  // Capitalize the name
  newName = newName.charAt(0).toUpperCase() + newName.slice(1);

  // Find category in the array and update it
  const category = categories.find(c => c.id == categoryId);
  category.name = newName;
  category.emoji = newEmoji;

  // Update local storage
  saveCategoriesToLocal(categories);

  // Update the sidebar
  updatePage.generateCategoriesMenu(categories);

  // Update the dropdown
  updatePage.generateCategoriesDropdownMarkup(categories);

  // Close this modal
  updatePage.closeModal('add-category-modal');
}
