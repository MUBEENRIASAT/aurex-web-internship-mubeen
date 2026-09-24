// ============================================
// TASK MANAGER - AUREX WEEK 4
// ============================================


// ============================================
// DOM ELEMENTS
// ============================================

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const errorMessage = document.getElementById("error-message");
const emptyMessage = document.getElementById("empty-message");

const submitButton = document.getElementById("submit-button");
const cancelButton = document.getElementById("cancel-button");
const formTitle = document.getElementById("form-title");

const filterButtons = document.querySelectorAll(".filter-btn");


// ============================================
// VARIABLES
// ============================================

let tasks = [];
let editingTaskId = null;
let currentFilter = "all";


// ============================================
// LOAD TASKS FROM LOCAL STORAGE
// ============================================

function loadTasks() {

    const storedTasks = localStorage.getItem("aurexTasks");

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    } else {
        tasks = [];
    }

    displayTasks();
}


// ============================================
// SAVE TASKS TO LOCAL STORAGE
// ============================================

function saveTasks() {

    localStorage.setItem(
        "aurexTasks",
        JSON.stringify(tasks)
    );
}


// ============================================
// FORM VALIDATION
// ============================================

function validateTask(taskText) {

    if (taskText.trim() === "") {

        errorMessage.textContent =
            "Task cannot be empty.";

        return false;
    }

    if (taskText.trim().length < 3) {

        errorMessage.textContent =
            "Task must contain at least 3 characters.";

        return false;
    }

    errorMessage.textContent = "";

    return true;
}


// ============================================
// ADD TASK
// ============================================

function addTask(taskText) {

    const newTask = {

        id: Date.now(),

        title: taskText.trim(),

        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    displayTasks();
}


// ============================================
// UPDATE TASK
// ============================================

function updateTask(taskId, newTitle) {

    const task = tasks.find(function(task) {

        return task.id === taskId;

    });

    if (task) {

        task.title = newTitle.trim();

        saveTasks();

        displayTasks();
    }
}


// ============================================
// DELETE TASK
// ============================================

function deleteTask(taskId) {

    tasks = tasks.filter(function(task) {

        return task.id !== taskId;

    });

    saveTasks();

    displayTasks();
}


// ============================================
// TOGGLE TASK COMPLETION
// ============================================

function toggleTask(taskId) {

    const task = tasks.find(function(task) {

        return task.id === taskId;

    });

    if (task) {

        task.completed = !task.completed;

        saveTasks();

        displayTasks();
    }
}


// ============================================
// FILTER TASKS
// ============================================

function getFilteredTasks() {

    if (currentFilter === "pending") {

        return tasks.filter(function(task) {

            return !task.completed;

        });

    }

    if (currentFilter === "completed") {

        return tasks.filter(function(task) {

            return task.completed;

        });
    }

    return tasks;
}


// ============================================
// DISPLAY TASKS
// ============================================

function displayTasks() {

    taskList.innerHTML = "";

    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

        return;

    } else {

        emptyMessage.style.display = "none";
    }


    // Loop through tasks

    filteredTasks.forEach(function(task) {

        const taskCard = document.createElement("div");

        taskCard.className = "task-card";


        // Task information

        const taskInfo = document.createElement("div");

        taskInfo.className = "task-info";


        // Checkbox

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "task-checkbox";

        checkbox.checked = task.completed;


        checkbox.addEventListener("change", function() {

            toggleTask(task.id);

        });


        // Task title

        const taskTitle = document.createElement("span");

        taskTitle.className = "task-title";

        taskTitle.textContent = task.title;


        if (task.completed) {

            taskTitle.classList.add("completed");

        }


        taskInfo.appendChild(checkbox);

        taskInfo.appendChild(taskTitle);


        // Action buttons

        const taskActions = document.createElement("div");

        taskActions.className = "task-actions";


        // Edit button

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        editButton.className = "edit-btn";


        editButton.addEventListener("click", function() {

            startEditing(task);

        });


        // Delete button

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.className = "delete-btn";


        deleteButton.addEventListener("click", function() {

            deleteTask(task.id);

        });


        taskActions.appendChild(editButton);

        taskActions.appendChild(deleteButton);


        // Add everything to card

        taskCard.appendChild(taskInfo);

        taskCard.appendChild(taskActions);

        taskList.appendChild(taskCard);

    });
}


// ============================================
// START EDITING
// ============================================

function startEditing(task) {

    editingTaskId = task.id;

    taskInput.value = task.title;

    formTitle.textContent = "Edit Task";

    submitButton.textContent = "Update Task";

    cancelButton.classList.remove("hidden");

    taskInput.focus();
}


// ============================================
// CANCEL EDITING
// ============================================

function cancelEditing() {

    editingTaskId = null;

    taskInput.value = "";

    formTitle.textContent = "Add New Task";

    submitButton.textContent = "Add Task";

    cancelButton.classList.add("hidden");

    errorMessage.textContent = "";
}


// ============================================
// FORM SUBMIT EVENT
// ============================================

taskForm.addEventListener("submit", function(event) {

    // Prevent page refresh

    event.preventDefault();


    const taskText = taskInput.value;


    // Validate input

    if (!validateTask(taskText)) {

        return;
    }


    // Update existing task

    if (editingTaskId !== null) {

        updateTask(
            editingTaskId,
            taskText
        );

        cancelEditing();

    }

    // Add new task

    else {

        addTask(taskText);

        taskInput.value = "";
    }

});


// ============================================
// CANCEL BUTTON EVENT
// ============================================

cancelButton.addEventListener("click", function() {

    cancelEditing();

});


// ============================================
// FILTER BUTTON EVENTS
// ============================================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Remove active class

        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        // Add active class

        button.classList.add("active");


        // Change filter

        currentFilter = button.dataset.filter;


        // Update task list

        displayTasks();

    });

});


// ============================================
// INITIALIZE APPLICATION
// ============================================

loadTasks();