// Variables for the INPUT UI
const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

//Variables for the Coundown UI
const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const timeElements = document.querySelectorAll('span');
const countdownBtn = document.getElementById('countdown-button');

//Variables for the Complete UI
const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

// Global variables to be used later
let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

// Variables to later use for time math
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour *60;

// Set Date Input Minimum to be the same as today
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// This will populate the countdown UI and Complete UI
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;

        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);

        // This will hide the INPUT UI so later can show the COUNTDOWN UI
        inputContainer.hidden = true;

        // This will check if countdown finished and if yes launch Complete UI
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        } else {
            // Else, show the Countdown UI in progress
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            countdownEl.hidden = false;
            completeEl.hidden = true;
        }
    }, second);
}

// Take values from FORM INPUT
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    // Check for valid date
    if (countdownDate === '') {
        alert('Please select a valid Date for the Countdown');
    } else {
        // Get number version of current date and later updateDom
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Reset all Values of the Countdown Button
function reset() {
    // Hide Countdown UI and shows Input UI
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // Stop the countdown clock
    clearInterval(countdownActive);
    // Reset values of the countdown UI
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

// Checks if there is local storage and launch accordingly
function restorePreviousCountdown() {
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Event listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// Load function that checks localStorage
restorePreviousCountdown();