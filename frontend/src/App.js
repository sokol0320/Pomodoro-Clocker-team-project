import React, { useState, useEffect } from 'react';
import './index.css';
import Auth from './components/Auth';
import Timer from './components/Timer';
import Settings from './components/Settings';
import Stats from './components/Stats';
import History from './components/History';
import Tasks from './components/Tasks'; // НОВИЙ КОМПОНЕНТ
import { requestNotificationPermission, notifyTimerEnd } from './utils/notifications';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('pomodoro_user')));
  const [screen, setScreen] = useState('timer');
  const [stage, setStage] = useState('focus');
  const [completedCount, setCompletedCount] = useState(0);

  // Нові стани: Тема, Задачі та Активна задача
  const [theme, setTheme] = useState(() => localStorage.getItem('pomodoro_theme') || 'light');
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('pomodoro_tasks')) || []);
  const [activeTask, setActiveTask] = useState(null);

  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('pomodoro_settings')) || {
    focusTime: 25, shortBreak: 5, longBreak: 15, longBreakInterval: 4
  });

  const [minutes, setMinutes] = useState(settings.focusTime);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('pomodoro_history')) || []);

  useEffect(() => { localStorage.setItem('pomodoro_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('pomodoro_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('pomodoro_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('pomodoro_tasks', JSON.stringify(tasks)); }, [tasks]);

  useEffect(() => { requestNotificationPermission(); }, []);

  useEffect(() => {
    if (!isActive && seconds === 0) {
      setMinutes(stage === 'focus' ? settings.focusTime : stage === 'short_break' ? settings.shortBreak : settings.longBreak);
    }
  }, [settings, stage, isActive, seconds]);

  const handleLogin = (username) => {
    const u = { username };
    setUser(u);
    localStorage.setItem('pomodoro_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pomodoro_user');
    setScreen('timer');
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Завершення сесії (прив'язка тегу активної задачі)
  const handleSessionComplete = (duration) => {
    const newSession = {
      id: Date.now(),
      duration,
      date: new Date().toISOString(),
      stage,
      tag: activeTask ? activeTask.title : null // Тег = назва задачі (якщо є)
    };
    setHistory(prev => [newSession, ...prev]);
    notifyTimerEnd(stage);
  };

  // Функція для початку задачі з меню задач
  const startTask = (task) => {
    setActiveTask(task);
    setScreen('timer'); // Одразу перекидаємо на таймер
  };

  // Функція для завершення активної задачі з таймера
  const finishActiveTask = () => {
    setTasks(prev => prev.filter(t => t.id !== activeTask.id)); // Видаляємо з активних/списку
    setActiveTask(null);
  };

  if (!user) {
    return <div className={`app-container ${theme}`}><Auth onLogin={handleLogin} /></div>;
  }

  return (
      <div className={`app-container ${theme}`}>
        <nav className="navbar">
          <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>⏱️ Pomodoro Clocker</span>
          <div className="nav-links">
            <button onClick={() => setScreen('timer')} className={`nav-btn ${screen === 'timer' ? 'active' : ''}`}>Таймер</button>
            <button onClick={() => setScreen('tasks')} className={`nav-btn ${screen === 'tasks' ? 'active' : ''}`}>Задачі</button>
            <button onClick={() => setScreen('settings')} className={`nav-btn ${screen === 'settings' ? 'active' : ''}`}>Налаштування</button>
            <button onClick={() => setScreen('stats')} className={`nav-btn ${screen === 'stats' ? 'active' : ''}`}>Статистика</button>
            <button onClick={() => setScreen('history')} className={`nav-btn ${screen === 'history' ? 'active' : ''}`}>Історія</button>

            <button onClick={toggleTheme} className="theme-toggle-btn">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button onClick={handleLogout} className="logout-btn">Вихід</button>
          </div>
        </nav>

        {screen === 'timer' && (
            <Timer
                settings={settings} stage={stage} setStage={setStage} minutes={minutes} setMinutes={setMinutes}
                seconds={seconds} setSeconds={setSeconds} isActive={isActive} setIsActive={setIsActive}
                completedCount={completedCount} setCompletedCount={setCompletedCount} onSessionComplete={handleSessionComplete}
                activeTask={activeTask} finishActiveTask={finishActiveTask} // Передаємо задачу в таймер
            />
        )}
        {screen === 'tasks' && <Tasks tasks={tasks} setTasks={setTasks} startTask={startTask} activeTask={activeTask} />}
        {screen === 'settings' && <Settings settings={settings} setSettings={setSettings} onBack={() => setScreen('timer')} />}
        {screen === 'stats' && <Stats history={history} />}
        {screen === 'history' && <History history={history} onBack = {() => setScreen('timer')} />}
      </div>
  );
}

export default App;