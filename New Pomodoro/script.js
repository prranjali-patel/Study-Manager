// Fetch timer settings from the backend when the page loads
async function getTimerSettings() {
  const response = await fetch('/timer-settings');
  const data = await response.json();

  // Update the times from backend
  studyTime = data.study_time;
  shortBreakTime = data.short_break_time;
  longBreakTime = data.long_break_time;
  sessionCount = data.session_count;
  breakCount = data.break_count;
  cycleCount = data.cycle_count;

  updateTimeDisplay();
  sessionCountDisplay.textContent = sessionCount;
  breakCountDisplay.textContent = breakCount;
  cycleCountDisplay.textContent = cycleCount;
}

// Function to send updated stats to the backend
async function updateStats() {
  const response = await fetch('/update-stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_count: sessionCount,
      break_count: breakCount,
      cycle_count: cycleCount
    })
  });

  const result = await response.json();
  console.log(result.message);
}

// Function to send updated timer durations to the backend
async function updateTimer() {
  const response = await fetch('/update-timer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      study_time: studyTime,
      short_break_time: shortBreakTime,
      long_break_time: longBreakTime
    })
  });

  const result = await response.json();
  console.log(result.message);
}

// Call the backend API to get timer settings when the page loads
window.onload = getTimerSettings;

// You can call updateStats() whenever you update the stats on the frontend
// e.g., after completing a session or break


// Variables for timer
let studyTime = 25 * 60; // 25 minutes in seconds
let shortBreakTime = 5 * 60;  // 5 minutes in seconds
let longBreakTime = 15 * 60;  // 15 minutes in seconds
let currentTimer = studyTime;
let sessionCount = 0;
let breakCount = 0;
let cycleCount = 0;
let timerInterval = null;
let currentSession = "study"; // 'study', 'short-break', 'long-break'

// DOM Elements
const timeDisplay = document.getElementById("time-display");
const sessionCountDisplay = document.getElementById("session-count");
const breakCountDisplay = document.getElementById("break-count");
const currentSessionDisplay = document.getElementById("current-session");
const cycleCountDisplay = document.getElementById("cycle-count");
const cycleMessageDiv = document.getElementById("cycle-message");
const cycleMessageText = document.getElementById("cycle-message-text");

// Format time into mm:ss
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update the time display
function updateTimeDisplay() {
  timeDisplay.textContent = formatTime(currentTimer);
}

// Start Timer
function startTimer() {
  if (timerInterval) return; // Prevent multiple intervals

  timerInterval = setInterval(() => {
    currentTimer--;
    updateTimeDisplay();

    if (currentTimer <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      handleSessionSwitch(); // Automatically switch to next session when time is up
    }
  }, 1000);
}

// Stop Timer
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// Reset Timer
function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  currentSession = "study";
  currentTimer = studyTime;
  sessionCount = 0;
  breakCount = 0;
  cycleCount = 0;
  updateSessionDisplay();
  updateTimeDisplay();
  sessionCountDisplay.textContent = sessionCount;
  breakCountDisplay.textContent = breakCount;
  cycleCountDisplay.textContent = cycleCount;
  hideCycleMessage();
}

// Update the session display (study, short break, or long break)
function updateSessionDisplay() {
  if (currentSession === "study") {
    currentSessionDisplay.textContent = "Study Session";
    currentSessionDisplay.className = "text-2xl font-semibold mb-4 text-purple-500";
  } else if (currentSession === "short-break") {
    currentSessionDisplay.textContent = "Short Break";
    currentSessionDisplay.className = "text-2xl font-semibold mb-4 text-green-500";
  } else if (currentSession === "long-break") {
    currentSessionDisplay.textContent = "Long Break";
    currentSessionDisplay.className = "text-2xl font-semibold mb-4 text-yellow-500";
  }
}

// Handle session switching
function handleSessionSwitch() {
  if (currentSession === "study") {
    sessionCount++;
    sessionCountDisplay.textContent = sessionCount;

    if (sessionCount % 4 === 0) {
      switchToLongBreak(); // Switch to long break every 4th study session
    } else {
      switchToShortBreak(); // Switch to short break after other study sessions
    }
  } else {
    breakCount++;
    breakCountDisplay.textContent = breakCount;

    if (currentSession === "long-break") {
      cycleCount++;
      cycleCountDisplay.textContent = cycleCount;
      showCycleMessage(cycleCount); // Show the cycle completion message
    }

    switchToStudy(); // Switch back to study session after a break
  }
}

// Manually switch to study session
function switchToStudy() {
  currentSession = "study";
  currentTimer = studyTime;
  updateSessionDisplay();
  updateTimeDisplay();
  startTimer(); // Automatically start the next session
}

// Manually switch to short break
function switchToShortBreak() {
  currentSession = "short-break";
  currentTimer = shortBreakTime;
  updateSessionDisplay();
  updateTimeDisplay();
  startTimer(); // Automatically start the next session
}

// Manually switch to long break
function switchToLongBreak() {
  currentSession = "long-break";
  currentTimer = longBreakTime;
  updateSessionDisplay();
  updateTimeDisplay();
  startTimer(); // Automatically start the next session
}

// Show cycle completion message
function showCycleMessage(cycleNumber) {
  cycleMessageText.textContent = `🎉 Great job! You've completed study cycle ${cycleNumber}! 🎉`;
  cycleMessageDiv.classList.remove("hidden");

  // Hide the message after some time
  setTimeout(() => {
    hideCycleMessage();
  }, 5000);
}

// Hide cycle completion message
function hideCycleMessage() {
  cycleMessageDiv.classList.add("hidden");
}

// Set Study Time
document.getElementById("set-study-time").addEventListener("click", () => {
  const newStudyTime = prompt("Enter study time in minutes:");
  if (newStudyTime && !isNaN(newStudyTime)) {
    studyTime = newStudyTime * 60;
    if (currentSession === "study") {
      currentTimer = studyTime;
      updateTimeDisplay();
    }
  }
});

// Set Short Break Time
document.getElementById("set-short-break-time").addEventListener("click", () => {
  const newShortBreakTime = prompt("Enter short break time in minutes:");
  if (newShortBreakTime && !isNaN(newShortBreakTime)) {
    shortBreakTime = newShortBreakTime * 60;
    if (currentSession === "short-break") {
      currentTimer = shortBreakTime;
      updateTimeDisplay();
    }
  }
});

// Set Long Break Time
document.getElementById("set-long-break-time").addEventListener("click", () => {
  const newLongBreakTime = prompt("Enter long break time in minutes:");
  if (newLongBreakTime && !isNaN(newLongBreakTime)) {
    longBreakTime = newLongBreakTime * 60;
    if (currentSession === "long-break") {
      currentTimer = longBreakTime;
      updateTimeDisplay();
    }
  }
});

// Button Click Listeners
document.getElementById("start-timer").addEventListener("click", startTimer);
document.getElementById("stop-timer").addEventListener("click", stopTimer);
document.getElementById("reset-timer").addEventListener("click", resetTimer);

document.getElementById("switch-to-study").addEventListener("click", switchToStudy);
document.getElementById("switch-to-short-break").addEventListener("click", switchToShortBreak);
document.getElementById("switch-to-long-break").addEventListener("click", switchToLongBreak);

// Initial Setup
updateSessionDisplay();
updateTimeDisplay();
sessionCountDisplay.textContent = sessionCount;
breakCountDisplay.textContent = breakCount;
cycleCountDisplay.textContent = cycleCount;
