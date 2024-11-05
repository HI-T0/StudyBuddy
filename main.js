import { initCalendar } from './calendar.js';
import { initTodoList } from './todo.js';
import { initPomodoro } from './pomodoro.js';
import { initFlashcards } from './flashcards.js';
import { initNotes } from './notes.js';
import { initStudyGroups } from './studyGroups.js';
import { initResourceLibrary } from './resourceLibrary.js';
import { initProgressTracker } from './progressTracker.js';
import { initQuiz } from './quiz.js';
import { initForum } from './forum.js';
import { initGoals } from './goals.js';
import { initDashboard } from './dashboard.js';
import { initNotifications, showDailyTip } from './notifications.js';

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initCalendar();
    initTodoList();
    initPomodoro();
    initFlashcards();
    initNotes();
    initStudyGroups();
    initResourceLibrary();
    initProgressTracker();
    initQuiz();
    initForum();
    initGoals();
    initDashboard();
    initNotifications();
    showDailyTip();
});

function initTabs() {
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    const tabContents = document.querySelectorAll('.tab-content');

    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const tabName = trigger.getAttribute('data-tab');
            
            tabTriggers.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            trigger.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// Initialize Lucide icons
lucide.createIcons();
