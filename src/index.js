import "./styles.css";

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
let categories = []
let cat1 = new Category(
  "Sport",
  "🤾"
);
let cat2 = new Category(
  "Programming",
  "💻"
);
categories.push(cat1, cat2);
// Main content div
const content = document.getElementById('content');

let tasks = []

// Load a new task in the DOM
function generateTaskMarkup(task) {
  
  // Main container, contains status and content
  const container = document.createElement('div');
  container.classList.add('task');

  const status = document.createElement('input');
  status.classList.add('status');
  status.type = 'checkbox';

  // Container for content, contains everything else
  const taskContent = document.createElement('div');
  taskContent.classList.add('task-content');

  const header = document.createElement('h2');
  header.classList.add('title');
  header.innerText = task.title;

  // Container for category and date
  const dateCategoryContainer = document.createElement('div');
  dateCategoryContainer.classList.add('date-category-container');

  const category = document.createElement('p');
  category.classList.add('category');
  category.innerText = task.category;

  const dueDate = document.createElement('p');
  dueDate.classList.add('due-date');
  dueDate.innerText = task.dueDate;

  dateCategoryContainer.append(category, dueDate);


  const description = document.createElement('p');
  description.classList.add('description');
  description.innerText = task.description;

  taskContent.append(header, dateCategoryContainer, description);


  // Finally, a chevron for expanding the task
  const chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  // chevron.setAttributeNS(null, 'xmlns', "http://www.w3.org/2000/svg");
  chevron.setAttributeNS(null, 'viewBox', "0 0 24 24");
  chevron.setAttributeNS(null, 'fill', "none");
  chevron.setAttributeNS(null, 'stroke-width', "1.5");
  chevron.setAttributeNS(null, 'stroke', "currentColor");
  chevron.setAttributeNS(null, 'class', "task-chevron");

  const chevronPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  chevronPath.setAttributeNS(null, "stroke-linecap", "round");
  chevronPath.setAttributeNS(null, "stroke-linejoin", "round");
  chevronPath.setAttributeNS(null, "d", "m19.5 8.25-7.5 7.5-7.5-7.5");

  chevron.append(chevronPath);

  container.append(status, taskContent, chevron);

  // Insert to the top of the list
  // content.append(container);
  content.insertBefore(container, content.firstChild);
}

function generateCategoriesDropdownMarkup() {
  const dropdown = document.getElementById('category-dropdown');

  // Clear existing
  dropdown.innerHTML = '';

  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.innerText = 'Choose category';
  dropdown.append(defaultOption);

  // Loop through categories and populate
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = `${category.emoji} ${category.name}`;
    option.innerText = `${category.emoji} ${category.name}`;
    dropdown.append(option);
  });
}

const defaultCategory = new Category(
  '',
  ''
);

let task1 = new Task(
  "finish writing this class",
  "put things in it like title, desc, due date, status",
  "2024-10-15"
);
let task2 = new Task(
  "Second task",
  "Some other stuff: title, desc, due date, status",
  "2024-10-15"
);

tasks.push(task1);
tasks.push(task2);

generateTaskMarkup(task1);
// generateTaskMarkup(task2);

window.onload = function() {
  // When title is clicked, select all
  const titleInput = document.querySelector('input[name=title]');
  titleInput.addEventListener('click', () => {
    titleInput.select();
  })

  // New task button listener
  const newTaskButton = document.getElementById('new-task-button');
  newTaskButton.addEventListener('click', createNewTask);

  // Prevent form submission
  const form = document.getElementById('task-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    createNewTask();
  })

  // Populate dropdown
  generateCategoriesDropdownMarkup();
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
  generateTaskMarkup(task);

  // Clear the form
  titleInput.value = '';
  titleInput.focus();
}
