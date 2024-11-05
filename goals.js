export function initGoals() {
    const goalForm = document.getElementById('goal-form');
    const goalsList = document.getElementById('goals-list');

    let goals = JSON.parse(localStorage.getItem('goals')) || [];

    function renderGoals() {
        goalsList.innerHTML = '';
        goals.forEach((goal, index) => {
            const goalElement = document.createElement('div');
            goalElement.classList.add('goal');
            goalElement.innerHTML = `
                <h3>${goal.title}</h3>
                <p>Deadline: ${goal.deadline}</p>
                <p>${goal.description}</p>
                <button onclick="deleteGoal(${index})">Delete</button>
            `;
            goalsList.appendChild(goalElement);
        });
    }

    goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('goal-title').value;
        const deadline = document.getElementById('goal-deadline').value;
        const description = document.getElementById('goal-description').value;
        goals.push({ title, deadline, description });
        localStorage.setItem('goals', JSON.stringify(goals));
        goalForm.reset();
        renderGoals();
    });

    window.deleteGoal = (index) => {
        goals.splice(index, 1);
        localStorage.setItem('goals', JSON.stringify(goals));
        renderGoals();
    };

    renderGoals();
}