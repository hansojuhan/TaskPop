// Load a new task in the DOM
export function generateTaskMarkup(task) {
  
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
    option.value = `${category.emoji} ${category.name}`;
    option.innerText = `${category.emoji} ${category.name}`;
    dropdown.append(option);
  });
}

export function generateCategoriesMenu(categories) {
  // Find list
  const menu = document.getElementById('categories-menu');

  // For each category, add a li
  categories.forEach(category => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#';
    link.innerText = `${category.emoji} ${category.name}`;
    listItem.append(link);
    menu.append(listItem);
  });

  // Create the add new category button as well
  const listItem = document.createElement('li');
  const newCategoryButton = document.createElement('button');
  newCategoryButton.type = 'button';
  newCategoryButton.innerText = 'Add category';
  listItem.append(newCategoryButton);
  menu.append(listItem);

  // Add event listener that opens a modal
  newCategoryButton.addEventListener('click', showNewCategoryModal);
}

function showNewCategoryModal() {
  console.log("modal");
  const modal = document.getElementById('add-category-modal');
  modal.showModal();
}
