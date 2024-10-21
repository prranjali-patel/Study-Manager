const modal = document.getElementById('modal');
const openModalButton = document.getElementById('openModal');
const taskForm = document.getElementById('taskForm');
const taskType = document.getElementById('taskType');
const dayInputContainer = document.getElementById('dayInputContainer');
const todayTasks = document.getElementById('todayTasks');
const weeklyTasks = document.getElementById('weeklyTasks');
const dateDisplay = document.getElementById('dateDisplay');
const daySelector = document.getElementById('daySelector');
const dailyProgressFill = document.getElementById('dailyProgressFill');
const dailyProgressText = document.getElementById('dailyProgressText');
const weeklyProgressFill = document.getElementById('weeklyProgressFill');
const weeklyProgressText = document.getElementById('weeklyProgressText');

let tasks = [];
let simulatedDay = getFormattedDate().day;

// Load tasks from localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        updateTasks();
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getFormattedDate() {
    const now = new Date();
    const day = now.getDay();
    return {
        day: day + 1, // Convert 0-6 (Sun-Sat) to 1-7
        dayName: getDayName(day + 1),
    };
}

function displayCurrentDateInfo() {
    const { dayName } = getFormattedDate();
    dateDisplay.innerText = `Today is: ${dayName} (Simulating: ${getDayName(simulatedDay)})`;
}

function getDayName(dayNumber) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber - 1]; // Convert to 0-based index
}

function updateTasks() {
    todayTasks.innerHTML = '';
    weeklyTasks.innerHTML = '';

    let dailyTotal = 0;
    let dailyCompleted = 0;
    let weeklyTotal = 0;
    let weeklyCompleted = 0;

    tasks.forEach(task => {
        const taskText = task.text;
        const taskDay = task.day;

        if (task.type === 'daily') {
            addTask(todayTasks, taskText, task);
            dailyTotal++;
            if (task.completed) dailyCompleted++;
        } else if (task.type === 'weekly') {
            if (taskDay === simulatedDay) {
                addTask(todayTasks, `${taskText} (Scheduled for ${getDayName(taskDay)})`, task);
                dailyTotal++;
                if (task.completed) dailyCompleted++;
            } else {
                addTask(weeklyTasks, `${taskText} (Scheduled for ${getDayName(taskDay)})`, task);
                weeklyTotal++;
                if (task.completed) weeklyCompleted++;
            }
        }
    });

    // Update progress bars
    updateProgressBar(dailyTotal, dailyCompleted, dailyProgressFill, dailyProgressText);
    updateProgressBar(dailyTotal + weeklyTotal, dailyCompleted + weeklyCompleted, weeklyProgressFill, weeklyProgressText);
}

function addTask(list, taskText, task) {
    const li = document.createElement('li');
    li.innerHTML = `
        <input type="checkbox" class="mr-2" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompletion(event, '${task.text}')"/> 
        ${taskText}
        <button onclick="openEditTaskModal('${task.text}')" class="ml-4 bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
        <button onclick="deleteTask('${task.text}')" class="ml-4 bg-red-500 text-white px-2 py-1 rounded">Delete</button>
    `;
    list.appendChild(li);
}

function toggleTaskCompletion(event, taskText) {
    const checkbox = event.target;
    tasks = tasks.map(task => {
        if (task.text === taskText) {
            return { ...task, completed: checkbox.checked };
        }
        return task;
    });
    saveTasks(); // Save tasks after updating
    updateTasks();
}

function deleteTask(taskText) {
    tasks = tasks.filter(task => task.text !== taskText);
    saveTasks(); // Save tasks after deletion
    updateTasks();
}

function openEditTaskModal(taskText) {
    const task = tasks.find(t => t.text === taskText);
    if (task) {
        document.getElementById('taskInput').value = task.text;
        taskType.value = task.type;
        if (task.type === 'weekly') {
            dayInputContainer.classList.remove('hidden');
            document.getElementById('dayInput').value = task.day;
        } else {
            dayInputContainer.classList.add('hidden');
        }
        modal.classList.remove('hidden');
        modal.classList.add('modal-active');

        // Update the form submission to edit task
        taskForm.onsubmit = (event) => {
            event.preventDefault();
            editTask(taskText);
        };
    }
}

function editTask(oldTaskText) {
    const taskName = document.getElementById('taskInput').value.trim();
    const taskTypeValue = taskType.value;
    const dayValue = document.getElementById('dayInput').value;
    const dayNumber = parseInt(dayValue, 10);

    // Basic validation
    if (!taskName) {
        alert("Task name cannot be empty");
        return;
    }

    // Update task
    tasks = tasks.map(task => {
        if (task.text === oldTaskText) {
            if (taskTypeValue === 'daily') {
                return { text: taskName, type: 'daily', completed: task.completed };
            } else if (taskTypeValue === 'weekly') {
                if (!dayValue || isNaN(dayNumber) || dayNumber < 1 || dayNumber > 7) {
                    alert("Please select a valid day for the weekly task.");
                    return task; // Return original task if validation fails
                }
                return { text: taskName, type: 'weekly', day: dayNumber, completed: task.completed };
            }
        }
        return task; // Return unchanged task
    });

    saveTasks(); // Save tasks after editing
    updateTasks();
    modal.classList.add('hidden');
    modal.classList.remove('modal-active');
    taskForm.reset();
}

function updateProgressBar(total, completed, fillElement, textElement) {
    const percentage = total === 0 ? 0 : (completed / total) * 100;
    fillElement.style.width = `${percentage}%`;
    textElement.innerText = `${completed} of ${total} tasks completed (${Math.round(percentage)}%)`;
}

openModalButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
    modal.classList.add('modal-active');

    // Reset form for new task
    taskForm.reset();
    dayInputContainer.classList.add('hidden');
    taskForm.onsubmit = (event) => {
        event.preventDefault();
        addNewTask();
    };
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
        modal.classList.remove('modal-active');
    }
});

taskType.addEventListener('change', () => {
    const selectedType = taskType.value;
    dayInputContainer.classList.add('hidden');
    
    if (selectedType === 'weekly') {
        dayInputContainer.classList.remove('hidden');
    }
});

function addNewTask() {
    const taskName = document.getElementById('taskInput').value.trim();
    const taskTypeValue = taskType.value;
    const dayValue = document.getElementById('dayInput').value;
    const dayNumber = parseInt(dayValue, 10);

    // Basic validation
    if (!taskName) {
        alert("Task name cannot be empty");
        return;
    }

    if (taskTypeValue === 'daily') {
        tasks.push({ text: taskName, type: 'daily', completed: false });
    } else if (taskTypeValue === 'weekly') {
        if (!dayValue || isNaN(dayNumber) || dayNumber < 1 || dayNumber > 7) {
            alert("Please select a valid day for the weekly task.");
            return;
        }
        tasks.push({ text: taskName, type: 'weekly', day: dayNumber, completed: false });
    }

    saveTasks(); // Save tasks after adding
    updateTasks();
    modal.classList.add('hidden');
    modal.classList.remove('modal-active');
    taskForm.reset();
}

daySelector.addEventListener('change', (e) => {
    simulatedDay = parseInt(e.target.value, 10);
    displayCurrentDateInfo();
    updateTasks();
});

// Load tasks when the page loads
window.onload = () => {
    loadTasks();
    displayCurrentDateInfo();
};
