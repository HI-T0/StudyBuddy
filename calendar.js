export function initCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const assignmentForm = document.getElementById('assignment-form');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const currentMonthElement = document.getElementById('current-month');

    let currentDate = new Date();
    let selectedDate = null;
    let assignments = JSON.parse(localStorage.getItem('assignments')) || {};

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        currentMonthElement.textContent = new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        calendarGrid.innerHTML = '';

        // Add day labels
        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayLabels.forEach(day => {
            const dayLabel = document.createElement('div');
            dayLabel.classList.add('calendar-day-label');
            dayLabel.textContent = day;
            calendarGrid.appendChild(dayLabel);
        });

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('calendar-day', 'empty');
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const dateString = date.toISOString().split('T')[0];

            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            
            if (assignments[dateString]) {
                dayElement.classList.add('has-assignment');
            }

            dayElement.innerHTML = `
                <div class="calendar-day-header">${i}</div>
                <div class="calendar-day-content">
                    ${assignments[dateString] ? assignments[dateString].map(a => `<div>${a.title}</div>`).join('') : ''}
                </div>
            `;

            dayElement.addEventListener('click', () => {
                selectedDate = dateString;
                assignmentForm.classList.remove('hidden');
                assignmentForm.style.position = 'absolute';
                assignmentForm.style.top = `${dayElement.offsetTop + dayElement.offsetHeight}px`;
                assignmentForm.style.left = `${dayElement.offsetLeft}px`;
            });

            calendarGrid.appendChild(dayElement);
        }
    }

    assignmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = e.target.elements.title.value;
        const subject = e.target.elements.subject.value;
        const estimatedEffort = parseInt(e.target.elements.estimatedEffort.value);

        if (!assignments[selectedDate]) {
            assignments[selectedDate] = [];
        }

        assignments[selectedDate].push({ title, subject, estimatedEffort });
        localStorage.setItem('assignments', JSON.stringify(assignments));

        assignmentForm.classList.add('hidden');
        assignmentForm.reset();
        renderCalendar();
    });

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    document.addEventListener('click', (e) => {
        if (!assignmentForm.contains(e.target) && !e.target.classList.contains('calendar-day')) {
            assignmentForm.classList.add('hidden');
        }
    });

    renderCalendar();
}