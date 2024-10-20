// Display current date
function updateDate() {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = currentDate.toLocaleDateString(undefined, options);
    document.getElementById('current-date').textContent = dateString;
}

// Display current time
function updateTime() {
    const currentTime = new Date();
    const timeString = currentTime.toLocaleTimeString();
    document.getElementById('current-time').textContent = timeString;
}

// Update both date and time every second
setInterval(updateTime, 1000);
updateDate();

// Random Motivational Quotes
const quotes = [
    "Believe you can and you're halfway there.",
    "Don't watch the clock; do what it does. Keep going.",
    "The secret of getting ahead is getting started.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Focus on being productive instead of busy.",
    "Your limitation—it’s only your imagination."
];

// Display a random quote
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('quote').textContent = quotes[randomIndex];
}

// Change quote every time the page loads
displayRandomQuote();
