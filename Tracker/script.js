// Dummy data for tasks (you can integrate with your backend)
const tasksCompleted = [
    "Completed Math assignment",
    "Revised 3 chapters of History",
    "Finished programming exercises",
    "Organized project notes",
    "Studied for Science quiz"
];

// Function to display completed tasks
function displayTasks() {
    const taskList = document.getElementById("task-list");
    tasksCompleted.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task;
        taskList.appendChild(li);
    });
}

// Display summary
function displaySummary() {
    const totalStudySessions = 6;  // Example data
    const totalBreaks = 4;
    const totalTasks = tasksCompleted.length;

    const summaryText = `
        You completed ${totalTasks} tasks, finished ${totalStudySessions} study sessions, 
        and took ${totalBreaks} breaks today. Great work!
    `;

    document.getElementById('summary-text').textContent = summaryText;
}

// Pie chart for Study Time Breakdown
function generateStudyTimeChart() {
    const ctx = document.getElementById('studyTimeChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Study Time', 'Break Time'],
            datasets: [{
                label: 'Time Spent',
                data: [300, 120],  // Example data: Study = 300 mins, Breaks = 120 mins
                backgroundColor: ['#6B46C1', '#68D391'],
            }]
        },
        options: {
            responsive: true,
        }
    });
}

// Line chart for Productivity Over Time
function generateProductivityChart() {
    const ctx = document.getElementById('productivityChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM', '7 PM'],  // Time of day
            datasets: [{
                label: 'Tasks Completed',
                data: [0, 1, 3, 5, 4, 6],  // Example data showing productivity curve
                backgroundColor: '#ED8936',
                borderColor: '#DD6B20',
                fill: true,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 6
                }
            }
        }
    });
}

// Initialize page with data
window.onload = function() {
    displayTasks();
    displaySummary();
    generateStudyTimeChart();
    generateProductivityChart();
};
