import 'emoji-picker-element';

// Import the 3 dots svg
import editIcon from "./img/3dots.svg";
import calendarIcon from "./img/calendar.svg";

import { updateTaskStatus, showCategory, showAllCategories, addNewCategory, editCategory } from './index';
import { getCategoryById } from './localStorage';

// Updates the h1 in the header
export function updatePageHeader(text) {
  const header = document.getElementById('header');
  header.innerText = text;
}

// Regenerate all tasks
export function regenerateAllTasksMarkup(tasks) {
  // Clear the previous
  const content = document.getElementById('content');
  content.innerHTML = '';
  
  // Populate tasks on the page
  tasks.forEach(task => {
    generateTaskMarkup(task);
  });
}

// Load a new task in the DOM
export function generateTaskMarkup(task) {
  
  // Main container, contains status and content
  const container = document.createElement('div');
  container.classList.add('task');

  // Status
  const status = document.createElement('input');
  status.classList.add('status');
  status.type = 'checkbox';
  // Set value according to 
  status.checked = task.isDone;
  // Add the task ID to the checkbox
  status.setAttribute('data-id', task.id);
  // Add a listener for the checkbox, so task status could be updated if checked
  status.addEventListener('click', updateTaskStatus);

  // Container for content, contains everything else
  const taskContent = document.createElement('div');
  taskContent.classList.add('task-content');

  // Header
  const header = document.createElement('h2');
  header.classList.add('title');
  header.innerText = task.title;

  // Container for category and date
  const dateCategoryContainer = document.createElement('div');
  dateCategoryContainer.classList.add('date-category-container');

  // Category
  const category = document.createElement('p');
  category.classList.add('category');

  // Fetch category by the id saved in task object to get the emoji and name
  // Check if the category exists
  const categoryValue = getCategoryById(task.category);
  if (categoryValue) {
    category.innerText = `${categoryValue.emoji} ${categoryValue.name}`;
  } else {
    category.innerText = '🗒️ wNo category'; // Fallback text for missing category
  }
  
  // Add a div for due date to contain the icon and the text
  const dueDateContainer = document.createElement('div');
  dueDateContainer.classList.add("due-date-container");
  const calendar = document.createElement('img');
  calendar.src = calendarIcon;

  const dueDate = document.createElement('p');
  dueDate.classList.add('due-date');

  // Check if due date exists
  if (task.dueDate) {
    // Format the date
    const formattedDate = new Date(task.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    dueDate.innerText = formattedDate;
  } else {
    dueDate.innerHTML = 'No due date';
  }

  dueDateContainer.append(calendar, dueDate);

  dateCategoryContainer.append(category, dueDateContainer);
  taskContent.append(header, dateCategoryContainer);
  container.append(status, taskContent);

  // Insert to the top of the list
  content.insertBefore(container, content.firstChild);
}

// Populate the categories
export function generateCategoriesDropdownMarkup(categories) {
  const dropdown = document.getElementById('category-dropdown');

  // Clear existing
  dropdown.innerHTML = '';

  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.innerText = '🗒️ Choose category';

  dropdown.append(defaultOption);

  // Loop through categories and populate
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.innerText = `${category.emoji} ${category.name}`;
    dropdown.append(option);
  });
}

export function generateCategoriesMenu(categories) {

  // Make sure categories is a valid array before using forEach
  if (!Array.isArray(categories) || categories.length === 0) {
    console.warn("No categories available to display.");
    // return;
  }

  // Find list
  const menu = document.getElementById('categories-menu');

  // Clear menu
  menu.innerHTML = '';

  // Add the all tasks link
  const allTasksItem = document.createElement('li');
  const allTasksButton = document.createElement('button');
  allTasksButton.type = 'button';
  allTasksButton.innerText = '🗒️ All tasks';

  allTasksButton.addEventListener('click', () => {
    // Remove active from other possibly highlighted menu items
    removeActiveClassFromMenu(menu);
    showAllCategories();
  });

  allTasksItem.append(allTasksButton);
  menu.append(allTasksItem);

  // For each category, add a li
  categories.forEach(category => {
    const listItem = document.createElement('li');
    const link = document.createElement('button');
    link.type = 'button';

    // Add listener for button click
    link.addEventListener('click', () => {
      // Remove active from other possibly highlighted menu items
      removeActiveClassFromMenu(menu);
      // Highlight menu
      link.classList.add('menu-active');
      // Call function to show tasks
      showCategory(category);
    });

    // Add inner text
    const linkText = document.createElement('p');
    linkText.innerText = `${category.emoji} ${category.name}`;

    // Add the 3 dots for editing
    const editButton = document.createElement('img');
    editButton.src = editIcon;
    editButton.alt = 'Edit category';

    // Add listener for it
    editButton.addEventListener('click', () => showEditCategoryModal(category));

    link.append(linkText, editButton);

    listItem.append(link);
    menu.append(listItem);
  });

  // Create the add new category button as well
  const listItem = document.createElement('li');
  const newCategoryButton = document.createElement('button');
  newCategoryButton.type = 'button';
  newCategoryButton.innerText = '➕ Add category';
  listItem.append(newCategoryButton);
  menu.append(listItem);

  // Add event listener that opens a modal
  newCategoryButton.addEventListener('click', showNewCategoryModal);
}

export function showNewCategoryModal() {
  const modal = document.getElementById('add-category-modal');

  // Add listener for Add category
  const addButton = document.getElementById('add-category-button');

  // Check that button exists in the DOM
  if (addButton) {
    const addButtonWithoutListeners = addButton.cloneNode(true); // Clone the button to remove existing event listeners
    addButton.replaceWith(addButtonWithoutListeners); //Replace the current button
    addButtonWithoutListeners.addEventListener('click', addNewCategory); // Add one new listener
  }

  // Listen for clicks outside the modal
  modal.addEventListener('click', (event) => {
    const dialogDimensions = modal.getBoundingClientRect();

    // Check if click was outside the modal content
    if (
      event.clientX < dialogDimensions.left || 
      event.clientX > dialogDimensions.right || 
      event.clientY < dialogDimensions.top || 
      event.clientY > dialogDimensions.bottom
    ) {
      modal.close(); // Close the modal
    }
  });

  // Add listener for the emoji to open emoji picker
  const emojiButton = document.getElementById('category-emoji-button');
  emojiButton.addEventListener('click', showEmojiPicker);

  // Set modal fields
  const modalTitle = document.querySelector('#category-modal-header h2')
  modalTitle.innerText = 'New category';

  const emojiField = document.getElementById('category-emoji-button');
  emojiField.innerText = '📃';

  const nameField = document.getElementById('category-name-button');
  nameField.value = '';

  modal.showModal();
}

export function showEditCategoryModal(category) {
  const modal = document.getElementById('add-category-modal');

  // Add listener for Edit category
  const addButton = document.getElementById('add-category-button');

  if (addButton) {
    const addButtonWithoutListeners = addButton.cloneNode(true);
    addButton.replaceWith(addButtonWithoutListeners);
    addButtonWithoutListeners.addEventListener('click', () => editCategory(category.id));
  }

  // Listen for clicks outside the modal
  modal.addEventListener('click', (event) => {
    const dialogDimensions = modal.getBoundingClientRect();

    // Check if click was outside the modal content
    if (
      event.clientX < dialogDimensions.left || 
      event.clientX > dialogDimensions.right || 
      event.clientY < dialogDimensions.top || 
      event.clientY > dialogDimensions.bottom
    ) {
      modal.close(); // Close the modal
    }
  });
  
  // Add listener for the emoji to open emoji picker
  const emojiButton = document.getElementById('category-emoji-button');
  emojiButton.addEventListener('click', showEmojiPicker);

  // Prefill fields on the modal
  const modalTitle = document.querySelector('#category-modal-header h2')
  modalTitle.innerText = 'Edit category';

  const emojiField = document.getElementById('category-emoji-button');
  emojiField.innerText = category.emoji;

  const nameField = document.getElementById('category-name-button');
  nameField.value = category.name;
  nameField.select();

  // Show modal
  modal.showModal();
}

// Takes in an id, finds the modal with that id and closes it
export function closeModal(modalId) {
  // Close the modal
  const modal = document.getElementById(modalId);
  modal.close();
}

// Shows the emoji picker and adds a listener for emoji click
function showEmojiPicker() {
  const modal = document.getElementById('add-category-modal');

  const picker = document.createElement('emoji-picker');

  // Set position and styling for the picker
  picker.style.position = 'fixed'; // or 'absolute' if you want it relative to the button
  picker.style.top = '75%'; // You can adjust this according to where you want it
  picker.style.left = '50%'; // Adjust this too
  picker.style.transform = 'translate(-50%, -50%)'; // Center it
  picker.style.zIndex = '999'; // High z-index to ensure it appears above everything

  modal.append(picker);

  // Listen to emoji click events
  document.querySelector('emoji-picker').addEventListener('emoji-click', event => chooseEmojiFromPicker(picker, event));
}

// Add emoji selection into the button and close the picker
function chooseEmojiFromPicker(picker, event) {
  const emojiButton = document.getElementById('category-emoji-button');
  
  // Get the emoji selection
  console.log(event.detail.unicode);
  emojiButton.innerText = event.detail.unicode;

  // Close the picker
  picker.remove();
}

// Helper function to remove the active class from all menu items
function removeActiveClassFromMenu(menu) {
  // Remove 'menu-active' class from all items in the menu
  const activeItems = menu.querySelectorAll('.menu-active');
  activeItems.forEach(item => {
    item.classList.remove('menu-active');
  });
}

// function createThreeDotsSvg() {
//   // Finally, a chevron for expanding the task
//   // const chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//   // chevron.setAttributeNS(null, 'viewBox', "0 0 24 24");
//   // chevron.setAttributeNS(null, 'fill', "none");
//   // chevron.setAttributeNS(null, 'stroke-width', "1.5");
//   // chevron.setAttributeNS(null, 'stroke', "currentColor");
//   // chevron.setAttributeNS(null, 'class', "task-chevron");

//   // const chevronPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
//   // chevronPath.setAttributeNS(null, "stroke-linecap", "round");
//   // chevronPath.setAttributeNS(null, "stroke-linejoin", "round");
//   // chevronPath.setAttributeNS(null, "d", "m19.5 8.25-7.5 7.5-7.5-7.5");

  
// }
