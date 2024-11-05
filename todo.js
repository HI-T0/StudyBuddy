export function initTodoList() {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoDate = document.getElementById('todo-date');
    const todoList = document.getElementById('todo-list');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${todo.task} (Due: ${todo.date})</span>
                <button onclick="removeTodo(${index})">Delete</button>
            `;
            todoList.appendChild(li);
        });
    }

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = todoInput.value;
        const date = todoDate.value;
        todos.push({ task, date });
        localStorage.setItem('todos', JSON.stringify(todos));
        todoInput.value = '';
        todoDate.value = '';
        renderTodos();
    });

    window.removeTodo = (index) => {
        todos.splice(index, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    };

    renderTodos();
}