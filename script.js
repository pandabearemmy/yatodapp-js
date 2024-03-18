const todoList = document.getElementById("todoList");
const newItemInput = document.getElementById("newItem");
const addButton = document.getElementById("addButton");
const exportButton = document.createElement("exportCSV");
const refreshButton = document.createElement("button");
const resetButton = document.createElement("button");

const STORAGE_KEY = "toDoList"; // Key for local storage

let toDoItems = []; // Array to store to-do items (key-value pairs)

const loadToDoList = () => {
    // Try to retrieve data from local storage
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        toDoItems = JSON.parse(storedData); // Parse JSON data
      } catch (error) {
        console.error("Error parsing local storage data:", error);
        // Handle parsing errors (optional: display message or use default data)
      }
    }
  };
  
const saveToDoList = () => {
    // Stringify the to-do items array
    const dataToSave = JSON.stringify(toDoItems);
    // Store in local storage
    localStorage.setItem(STORAGE_KEY, dataToSave); 
  };

const addItem = () => {
    // Get the new to-do item text
    const newItemText = newItemInput.value.trim();

    // Check if input is empty
    if (!newItemText) return;

    // Create a new to-do item object with timestamp
    const newTodo = {
        text: newItemText,
        timestamp: new Date().toLocaleString(), // Includes date and time
    };

    // Add a unique identifier (optional for removal)
    newTodo.id = Math.random().toString(36).substring(2, 15); // Unique string

    // Push the new item to the array
    toDoItems.push(newTodo);

    // Save the updated list to locat storage
    saveToDoList();

    // Update the to-do list display
    updateTodoList();

    // Clear the input field
    newItemInput.value = "";
};

const updateTodoList = () => {
    todoList.innerHTML = "";
    // Loop through to-do items and create list elements
        for (const item of toDoItems) {
        const listItem = document.createElement("li");
        listItem.innerText = `${item.text} - Added: ${item.timestamp}`;
        todoList.appendChild(listItem);
    // Add functionality for each list item
    listItem.innerText = `${item.text} - Added: ${item.timestamp}`;
    const removeButton = document.createElement("button");
    removeButton.innerText = "Remove";
    removeButton.addEventListener("click", () => removeItem(item.id));
    const completeButton = document.createElement("button");
    completeButton.innerText = "Complete";
    completeButton.addEventListener("click", () => completeItem(item.id));
    listItem.appendChild(removeButton);
    listItem.appendChild(completeButton);
    todoList.appendChild(listItem);
    }
};

const removeItem = (itemId) => {
    // Find the item index based on ID (if used)
    const itemIndex = toDoItems.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
    // Remove the item from the array
    toDoItems.splice(itemIndex, 1);
    }
    // Save the updated list to local storage
    saveToDoList();
    // Update the to-do list display
    updateTodoList();
};

const completeItem = (itemId) => {
    // Find the item based on ID (if used)
    const itemIndex = toDoItems.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      // Mark the item as completed
      toDoItems[itemIndex].completed = true;
  
      // Update the list item text with strikethrough and completion message
      const listItem = todoList.children[itemIndex]; // Access the corresponding list item element
      const completedText = document.createElement("span");
      completedText.innerText = " (completed at " + toDoItems[itemIndex].timestamp + ")";
      completedText.style.fontStyle = "italic"; // Set italics for completion message
      listItem.appendChild(completedText);
    }
    // Save the updated list to local storage
    saveToDoList();
  };

// Export functionality to .csv file
const exportToDoList = () => {
    let csvData ="Text,Added\n"; // Defines header row
    // Loop through to-do items and format for CSV
    for (const item of toDoItems) {
        csvData += `"${item.text}",${item.timestamp}\n`; //Escape quotes and add a newline
    }
    // Create a Blob object with CSV data
    const blob = new Blob([csvData], { type:"text/csv;charset=utf-8" });
    // Create a link element for download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "to-do-list.csv";
    link.click();
    // Revoke the object URL (to avoid memory leaks)
    URL.revokeObjectURL(link.href);
};

function exportList () {
    let csvData ="Text,Added\n"; // Defines header row
    // Loop through to-do items and format for CSV
    for (const item of toDoItems) {
        csvData += `"${item.text}",${item.timestamp}\n`; //Escape quotes and add a newline
    }
    // Create a Blob object with CSV data
    const blob = new Blob([csvData], { type:"text/csv;charset=utf-8" });
    // Create a link element for download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "to-do-list.csv";
    link.click();
    // Revoke the object URL (to avoid memory leaks)
    URL.revokeObjectURL(link.href);
};


function reloadApp () {
    updateTodoList();
}

function resetApp () {
    toDoItems = [];
    localStorage.removeItem(STORAGE_KEY);
    updateTodoList();
    alert("App cleared!");
}

// Adds the export button
exportButton.innerText = "Export to CSV";
exportButton.addEventListener("click", exportToDoList);
document.body.appendChild(exportButton);

// Adds a button to retrieve local storage
refreshButton.innerText = "Refresh List";
refreshButton.addEventListener("click", reloadApp);
document.body.appendChild(refreshButton);

// Adds a button to retrieve local storage
resetButton.innerText = "Reset App";
resetButton.addEventListener("click", resetApp);
document.body.appendChild(resetButton);

addButton.addEventListener("click", addItem);

// Load to-do list data on page load

loadToDoList();