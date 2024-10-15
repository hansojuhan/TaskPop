import 'emoji-picker-element';

import { updateTaskStatus, showCategory, showAllCategories } from './index';
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

  const header = document.createElement('h2');
  header.classList.add('title');
  header.innerText = task.title;

  // Container for category and date
  const dateCategoryContainer = document.createElement('div');
  dateCategoryContainer.classList.add('date-category-container');

  const category = document.createElement('p');
  category.classList.add('category');

  // Fetch category by the id saved in task object to get the emoji and name
  const categoryValue = getCategoryById(task.category);
  category.innerText = `${categoryValue.emoji} ${categoryValue.name}`

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

// Populate the categories
export function generateCategoriesDropdownMarkup(categories) {
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
    link.innerText = `${category.emoji} ${category.name}`;

    // Add listener for button click
    link.addEventListener('click', () => {
      // Remove active from other possibly highlighted menu items
      removeActiveClassFromMenu(menu);
      // Highlight menu
      link.classList.add('menu-active');
      // Call function to show tasks
      showCategory(category);
    });

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

// Export is for testing
export function showNewCategoryModal() {
  const modal = document.getElementById('add-category-modal');

  // Add listener for the emoji to open emoji picker
  const emojiButton = document.getElementById('category-emoji-button');
  emojiButton.addEventListener('click', showEmojiPicker);

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
