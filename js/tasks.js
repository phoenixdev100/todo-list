// Task management
let tasks = [];
let currentFilter = 'all';
let currentSort = 'newest';

// Calendar functionality
function openCalendar() {
    const dateInput = document.getElementById('taskDueDate');
    dateInput.showPicker();
}

// Add task
function addTask(event) {
    event.preventDefault();
    const taskInput = document.getElementById('taskInput');
    const taskPriority = document.getElementById('taskPriority');
    const taskDueDate = document.getElementById('taskDueDate');

    const task = {
        id: Date.now(),
        title: taskInput.value,
        completed: false,
        priority: taskPriority.value,
        dueDate: taskDueDate.value,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(task);
    saveTasks();
    renderTasks();
    updateStats();
    taskInput.value = '';
    taskDueDate.value = '';
    taskPriority.value = 'low';
}

// Toggle task completion
function toggleTask(taskId) {
    tasks = tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
    updateStats();
}

// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
    updateStats();
}

// Edit task
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    const newTitle = prompt('Edit task:', task.title);
    if (newTitle !== null && newTitle.trim() !== '') {
        tasks = tasks.map(t =>
            t.id === taskId ? { ...t, title: newTitle.trim() } : t
        );
        saveTasks();
        renderTasks();
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    tasks = savedTasks ? JSON.parse(savedTasks) : [];
    renderTasks();
    updateStats();
}

// Filter tasks
function filterTasks(filter) {
    currentFilter = filter;
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(button => button.classList.remove('active'));
    document.querySelector(`[onclick="filterTasks('${filter}')"]`).classList.add('active');
    renderTasks();
}

// Sort tasks
function sortTasks(sortBy) {
    currentSort = sortBy;
    renderTasks();
}

// Clear completed tasks
function clearCompletedTasks() {
    const hasCompletedTasks = tasks.some(task => task.completed);
    if (hasCompletedTasks) {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Update task statistics
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('pendingTasks').textContent = pendingTasks;
    document.getElementById('taskCount').textContent = pendingTasks;
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}

// Render tasks
function renderTasks() {
    const searchQuery = document.getElementById('searchTask')?.value.toLowerCase() || '';
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    taskList.innerHTML = '';

    let filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery);
        const matchesFilter = 
            currentFilter === 'all' ? true :
            currentFilter === 'active' ? !task.completed :
            task.completed;
        return matchesSearch && matchesFilter;
    });

    // Sort tasks
    filteredTasks.sort((a, b) => {
        switch(currentSort) {
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            case 'dueDate':
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            default: // newest
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <div class="task-content">
                <span class="task-title">${task.title}</span>
                <div class="task-meta">
                    <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                    ${task.dueDate ? `<span><i class="fas fa-calendar"></i> ${formatDate(task.dueDate)}</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button onclick="editTask(${task.id})"><i class="fas fa-edit"></i></button>
                <button onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
            </div>`;
        taskList.appendChild(taskElement);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set up Clear Completed button
    const clearCompletedBtn = document.querySelector('.clear-completed-btn');
    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    }
    // Set up calendar click handlers
    const dateInputWrapper = document.querySelector('.date-input-wrapper');
    if (dateInputWrapper) {
        dateInputWrapper.addEventListener('click', (e) => {
            if (e.target.classList.contains('task-due-date') || 
                e.target.classList.contains('calendar-icon')) {
                openCalendar();
            }
        });
    }

    // Set up search functionality
    const searchInput = document.getElementById('searchTask');
    if (searchInput) {
        searchInput.addEventListener('input', renderTasks);
    }

    // Load initial tasks
    loadTasks();
});
