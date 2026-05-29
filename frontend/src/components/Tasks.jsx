import React, { useState } from 'react';

const Tasks = ({ tasks, setTasks, startTask, activeTask }) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const newTask = { id: Date.now(), title: newTaskTitle.trim() };
        setTasks(prev => [...prev, newTask]);
        setNewTaskTitle('');
    };

    const handleDeleteTask = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="tasks-container">
            <h2>📋 Мої задачі</h2>

            <form onSubmit={handleAddTask} className="add-task-form">
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Що будемо робити?"
                    className="task-input"
                />
                <button type="submit" className="add-btn">Додати</button>
            </form>

            <ul className="task-list">
                {tasks.map(task => (
                    <li key={task.id} className={`task-item ${activeTask?.id === task.id ? 'active-task-item' : ''}`}>
                        <span>{task.title}</span>
                        <div className="task-actions">
                            {activeTask?.id !== task.id && (
                                <button onClick={() => startTask(task)} className="start-btn">▶ Почати</button>
                            )}
                            {activeTask?.id === task.id && (
                                <span className="active-badge">В процесі...</span>
                            )}
                            <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">❌</button>
                        </div>
                    </li>
                ))}
                {tasks.length === 0 && <p style={{opacity: 0.5}}>Немає активних задач. Створіть першу!</p>}
            </ul>
        </div>
    );
}

export default Tasks;