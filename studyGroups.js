export function initStudyGroups() {
    const createGroupForm = document.getElementById('create-group-form');
    const groupsList = document.getElementById('groups-list');

    let groups = JSON.parse(localStorage.getItem('groups')) || [];

    function renderGroups() {
        groupsList.innerHTML = '';
        groups.forEach((group, index) => {
            const groupElement = document.createElement('div');
            groupElement.classList.add('group');
            groupElement.innerHTML = `
                <h3>${group.name}</h3>
                <p>Subject: ${group.subject}</p>
                <button onclick="deleteGroup(${index})">Delete Group</button>
            `;
            groupsList.appendChild(groupElement);
        });
    }

    createGroupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('group-name').value;
        const subject = document.getElementById('group-subject').value;
        groups.push({ name, subject });
        localStorage.setItem('groups', JSON.stringify(groups));
        createGroupForm.reset();
        renderGroups();
    });

    window.deleteGroup = (index) => {
        groups.splice(index, 1);
        localStorage.setItem('groups', JSON.stringify(groups));
        renderGroups();
    };

    renderGroups();
}