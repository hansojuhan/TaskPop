// function that detects whether localStorage is both supported and available
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

export function loadTasksFromLocal() {
  // // Check if localstorage can be used
  // if (storageAvailable("localStorage")) {
  //   // Yippee! We can use localStorage awesomeness
  // } else {
  //   // Too bad, no localStorage for us
  //   console.log("Localstorage is not available!");
  // }
  let savedTasks = []

  if (localStorage.getItem('tasks')) {
    // const tasks = JSON.parse(localStorage.getItem('tasks'));
    savedTasks = localStorage.getItem('tasks');
    console.log("retrieved tasks:");
    console.log(savedTasks);
  }

  return savedTasks ? JSON.parse(savedTasks) : [];
}

export function saveTasksToLocal(tasks) {
  // Check if tasks already exists, if yes, remove it
  if (localStorage.getItem('tasks')) {
    localStorage.removeItem('tasks');
  }

  // Stringify the tasks array and save it
  localStorage.setItem("tasks", JSON.stringify(tasks));

  console.log("from local:");
  console.log(localStorage.getItem("tasks"));
}
