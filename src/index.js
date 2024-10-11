/**
 * 1. Write a class for the task
 * 
 * Generate a task, with:
- Title
- Description
- Due date
- Status (done, to do)
 * 
 */

// Task
class Task {
  constructor(title, description, dueDate) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
  }
}

const content = document.getElementById('content');

// Load a new task in the DOM
function generateTask(task) {
  
  const container = document.createElement('div');
  container.classList.add('task');

  const header = document.createElement('h2');
  header.classList.add('title');
  header.innerText = task.title;

  const description = document.createElement('p');
  description.classList.add('description');
  description.innerText = task.description;

  const dueDate = document.createElement('p');
  dueDate.classList.add('due-date');
  dueDate.innerText = task.dueDate;

  // Append everything
  container.append(header);
  container.append(description);
  container.append(dueDate);

  content.append(container);
}

let task1 = new Task(
  "finish writing this class",
  "put things in it like title, desc, due date, status",
  "2024-10-15"
)
let task2 = new Task(
  "Second task",
  "Some other stuff: title, desc, due date, status",
  "2024-10-15"
)

generateTask(task1);
generateTask(task2);
