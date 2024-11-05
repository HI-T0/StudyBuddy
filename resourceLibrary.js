export function initResourceLibrary() {
    const addResourceForm = document.getElementById('add-resource-form');
    const resourcesList = document.getElementById('resources-list');

    let resources = JSON.parse(localStorage.getItem('resources')) || [];

    function renderResources() {
        resourcesList.innerHTML = '';
        resources.forEach((resource, index) => {
            const resourceElement = document.createElement('div');
            resourceElement.classList.add('resource');
            resourceElement.innerHTML = `
                <h3>${resource.title}</h3>
                <p>Type: ${resource.type}</p>
                <a href="${resource.url}" target="_blank">View Resource</a>
                <button onclick="deleteResource(${index})">Delete</button>
            `;
            resourcesList.appendChild(resourceElement);
        });
    }

    addResourceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('resource-title').value;
        const url = document.getElementById('resource-url').value;
        const type = document.getElementById('resource-type').value;
        resources.push({ title, url, type });
        localStorage.setItem('resources', 
        JSON.stringify(resources));
        addResourceForm.reset();
        renderResources();
    });

    window.deleteResource = (index) => {
        resources.splice(index, 1);
        localStorage.setItem('resources', JSON.stringify(resources));
        renderResources();
    };

    renderResources();
}