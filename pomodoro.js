import { sendNotification } from './notifications.js';

export function initPomodoro() {
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('start-timer');
    const resetButton = document.getElementById('reset-timer');

    let timer;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let isRunning = false;

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            timer = setInterval(() => {
                timeLeft--;
                updateDisplay();
                if (timeLeft === 0) {
                    clearInterval(timer);
                    isRunning = false;
                    sendNotification('Pomodoro Timer', 'Your study session is complete!');
                    startButton.textContent = 'Start';
                }
            }, 1000);
            startButton.textContent = 'Pause';
        } else {
            clearInterval(timer);
            isRunning = false;
            startButton.textContent = 'Start';
        }
    }

    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        timeLeft = 25 * 60;
        updateDisplay();
        startButton.textContent = 'Start';
    }

    startButton.addEventListener('click', startTimer);
    resetButton.addEventListener('click', resetTimer);

    updateDisplay();
}