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

function getFormattedDate() {
    const now = new Date();
    const day = now.getDay();
    return {
        day: day + 1, // Adjusting to 1-based index
        dayName: getDayName(day + 1),
    };
}

function displayCurrentDateInfo() {
    const { dayName } = getFormattedDate();
    dateDisplay.innerText = `Today is: ${dayName} (Simulating: ${getDayName(simulatedDay)})`;
}

function getDayName(dayNumber) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber - 1];
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
    updateTasks();
}

function deleteTask(taskText) {
    tasks = tasks.filter(task => task.text !== taskText);
    updateTasks();
}

function updateProgressBar(total, completed, fillElement, textElement) {
    const percentage = total === 0 ? 0 : (completed / total) * 100;
    fillElement.style.width = `${percentage}%`;
    textElement.innerText = `${completed} of ${total} tasks completed (${Math.round(percentage)}%)`;
}

openModalButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
    modal.classList.add('modal-active');
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

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const taskName = document.getElementById('taskInput').value;
    const taskTypeValue = taskType.value;
    const dayValue = document.getElementById('dayInput').value;
    const dayNumber = parseInt(dayValue, 10);

    if (taskTypeValue === 'daily') {
        tasks.push({ text: taskName, type: 'daily', completed: false });
    } else if (taskTypeValue === 'weekly') {
        tasks.push({ text: taskName, type: 'weekly', day: dayNumber, completed: false });
    }

    updateTasks();
    modal.classList.add('hidden');
    modal.classList.remove('modal-active');
    taskForm.reset();
});

daySelector.addEventListener('change', (e) => {
    simulatedDay = parseInt(e.target.value, 10);
    displayCurrentDateInfo();
    updateTasks();
});

displayCurrentDateInfo();
updateTasks();
