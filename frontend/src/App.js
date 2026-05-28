import React, { useState, useEffect } from 'react';
import './index.css'; // Імпорт CSS файлу
import Auth from './components/Auth';
import Timer from './components/Timer';
import Settings from './components/Settings';
import Stats from './components/Stats';
import History from './components/History';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('pomodoro_user')));
  const [screen, setScreen] = useState('timer');
  const [stage, setStage] = useState('focus');
  const [completedCount, setCompletedCount] = useState(0);

  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('pomodoro_settings')) || {
    focusTime: 25, shortBreak: 5, longBreak: 15, longBreakInterval: 4
  });

  const [minutes, setMinutes] = useState(settings.focusTime);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('pomodoro_history')) || []);

  useEffect(() => { localStorage.setItem('pomodoro_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('pomodoro_history', JSON.stringify(history)); }, [history]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('pomodoro_users_db') || '[]');
    if (!users.find(u => u.username === 'testuser')) {
      users.push({ username: 'testuser', password: 'password123' });
      localStorage.setItem('pomodoro_users_db', JSON.stringify(users));
    }
  }, []);

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

  const handleSessionComplete = (duration) => {
    const newSession = { id: Date.now(), duration, date: new Date().toISOString() };
    setHistory(prev => [newSession, ...prev]);
  };

  if (!user) {
    return <div className="app-container"><Auth onLogin={handleLogin} /></div>;
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>⏱️ Pomodoro Clocker</span>
        <div className="nav-links">
          <button onClick={() => setScreen('timer')} className={`nav-btn ${screen === 'timer' ? 'active' : ''}`}>Таймер</button>
          <button onClick={() => setScreen('settings')} className={`nav-btn ${screen === 'settings' ? 'active' : ''}`}>Налаштування</button>
          <button onClick={() => setScreen('stats')} className={`nav-btn ${screen === 'stats' ? 'active' : ''}`}>Статистика</button>
          <button onClick={() => setScreen('history')} className={`nav-btn ${screen === 'history' ? 'active' : ''}`}>Історія</button>
          
          {/* Повертаємо вивід імені поточного користувача */}
          <span style={{ color: '#bdc3c7', fontSize: '0.9rem', marginLeft: '5px' }}>
            user: {user.username}
          </span>
          
          <button onClick={handleLogout} className="logout-btn">Вихід</button>
        </div>
      </nav>

      {screen === 'timer' && (
        <Timer 
          settings={settings} stage={stage} setStage={setStage} minutes={minutes} setMinutes={setMinutes}
          seconds={seconds} setSeconds={setSeconds} isActive={isActive} setIsActive={setIsActive}
          completedCount={completedCount} setCompletedCount={setCompletedCount} onSessionComplete={handleSessionComplete}
        />
      )}
      {screen === 'settings' && <Settings settings={settings} setSettings={setSettings} onBack={() => setScreen('timer')} />}
      {screen === 'stats' && <Stats history={history} onBack={() => setScreen('timer')} />}
      {screen === 'history' && <History history={history} onBack={() => setScreen('timer')} />}
    </div>
  );
}

export default App;