const taskInput = document.getElementById('taskInput');
const taskDateTime = document.getElementById('taskDateTime');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function render() {
    const filteredTasks = tasks.filter(function(task) {
        if (currentFilter === 'active') {
            return task.completed === false;
        } else if (currentFilter === 'completed') {
            return task.completed === true;
        } else {
            return true;
        }
    });

    let html = '';
    for (let i = 0; i < filteredTasks.length; i++) {
        const task = filteredTasks[i];
        const realIndex = tasks.indexOf(task);
        const completedClass = task.completed ? 'completed' : '';
        let formattedDateTime = '';
        if (task.dateTime) {
            formattedDateTime = task.dateTime.replace('T', ' ');
        } else {
            formattedDateTime = 'дата не указана';
        }
        html += '<li class="' + completedClass + '">';
        html += '<span>' + task.text + ' <span style="color:#888;font-size:12px;">' + formattedDateTime + '</span></span>';
        html += '<div>';
        html += '<button onclick="toggleTask(' + realIndex + ')">Вып</button>';
        html += '<button onclick="deleteTask(' + realIndex + ')">Уд</button>';
        html += '</div>';
        html += '</li>';
    }

    taskList.innerHTML = html;

    for (let i = 0; i < filterBtns.length; i++) {
        const btn = filterBtns[i];
        if (btn.dataset.filter === currentFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }
}

function addTask() {
    const text = taskInput.value.trim();
    const dateTime = taskDateTime.value;

    if (text === '') {
        alert('Пожалуйста, введите текст задачи');
        return;
    }

    if (dateTime === '') {
        alert('Пожалуйста, выберите дату и время выполнения');
        return;
    }

    tasks.push({
        text: text,
        dateTime: dateTime,
        completed: false
    });

    tasks.sort(function(a, b) {
        if (a.dateTime < b.dateTime) return -1;
        if (a.dateTime > b.dateTime) return 1;
        return 0;
    });

    saveTasks();
    render();
    taskInput.value = '';
    taskDateTime.value = '';
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    render();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    render();
}

for (let i = 0; i < filterBtns.length; i++) {
    const btn = filterBtns[i];
    btn.addEventListener('click', function() {
        currentFilter = btn.dataset.filter;
        render();
    });
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

render();