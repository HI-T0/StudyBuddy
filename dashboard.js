export function initDashboard() {
    const dashboard = document.getElementById('dashboard');
    
    // Sample widgets - replace with actual data and functionality
    const widgets = [
        { title: 'Upcoming Deadlines', content: 'Math Assignment - Tomorrow' },
        { title: 'Study Streak', content: '5 days' },
        { title: 'Recent Notes', content: 'History - World War II' },
        { title: 'Quiz Scores', content: 'Science: 85%' }
    ];

    widgets.forEach(widget => {
        const widgetElement = document.createElement('div');
        widgetElement.classList.add('widget');
        widgetElement.innerHTML = `
            <h3>${widget.title}</h3>
            <p>${widget.content}</p>
        `;
        dashboard.appendChild(widgetElement);
    });
}