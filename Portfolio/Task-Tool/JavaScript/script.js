document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const difficultySelect = document.getElementById('difficulty-select');
    const taskList = document.getElementById('task-list');
    const filterControls = document.querySelector('.filter-controls');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const feedbackMessage = document.getElementById('feedback-message');

    let tasks = JSON.parse(localStorage.getItem('taskToolTasks')) || [];
    let currentFilter = 'all';

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText === '') return;
        const newTask = {
            id: Date.now(),
            text: taskText,
            difficulty: difficultySelect.value,
            completed: false,
        };
        tasks.push(newTask);
        taskInput.value = '';
        saveAndRender();
    });

    taskList.addEventListener('click', (e) => {
        const taskItem = e.target.closest('li');
        if (!taskItem) return;
        const id = Number(taskItem.dataset.id);

        if (e.target.matches('.complete-btn') || e.target.parentElement.matches('.complete-btn')) {
            toggleComplete(id);
        }
        if (e.target.matches('.delete-btn')) {
            deleteTask(id);
        }
    });

    filterControls.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        renderTasks();
    });

    function toggleComplete(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) showFeedback(task.difficulty);
            saveAndRender();
        }
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem('taskToolTasks', JSON.stringify(tasks));
        renderTasks();
        updateProgress();
    }

    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<li style="text-align: center; color: #7f8c8d; border: none; background: none;">タスクはありません。</li>';
        } else {
            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.dataset.id = task.id;
                if (task.completed) li.classList.add('completed');
                
                li.innerHTML = `
                    <div class="task-content">
                        <span class="complete-btn">${task.completed ? '✅' : '⬜️'}</span>
                        <span class="task-text">${task.text}</span>
                        <span class="difficulty-badge ${task.difficulty}">${task.difficulty}</span>
                    </div>
                    <button class="delete-btn">🗑️</button>
                `;
                taskList.appendChild(li);
            });
        }
    }
    
    function updateProgress() {
        const completedTasks = tasks.filter(task => task.completed).length;
        const totalTasks = tasks.length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        progressBar.value = progress;
        progressText.textContent = `${Math.round(progress)}%`;
    }

    function showFeedback(difficulty) {
        let message = '';
        switch(difficulty) {
            case 'easy': message = 'よくできました！簡単なタスクも大事な一歩です！'; break;
            case 'normal': message = '素晴らしい！順調に進んでいますね！'; break;
            case 'hard': message = 'すごい！難しいタスクをやり遂げましたね！'; break;
        }
        feedbackMessage.textContent = message;
        feedbackMessage.className = `feedback-message show ${difficulty}`;
        setTimeout(() => feedbackMessage.classList.remove('show'), 3000);
    }

    saveAndRender();

    // --- サイト共通ヘッダーのハンバーガーメニュー機能 ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileNavToggle.classList.toggle('active');
        });
    }
});