import React, { useState } from 'react';

function Auth({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const users = JSON.parse(localStorage.getItem('pomodoro_users_db') || '[]');

        if (isRegistering) {
        if (users.find(u => u.username === username)) {
            setError('Користувач вже існує!');
            return;
        }
        users.push({ username, password });
        localStorage.setItem('pomodoro_users_db', JSON.stringify(users));
        onLogin(username);
        } else {
        const found = users.find(u => u.username === username && u.password === password);
        if (found) {
            onLogin(username);
        } else {
            setError('Неправильний логін або пароль!');
        }
        }
        setUsername('');
        setPassword('');
    };

    return (
        <div className="pomodoro-card">
            <h2>{isRegistering ? 'Реєстрація' : 'Вхід у Pomodoro Clocker'}</h2>
            <form onSubmit={handleSubmit} className="form-group">
                <input type="text" placeholder="Логін" value={username} onChange={e => setUsername(e.target.value)} required className="input-field" />
                <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required className="input-field" />
                {error && <p className="error-text">{error}</p>}
                <button type="submit" className="primary-btn">{isRegistering ? 'Зареєструватися' : 'Увійти'}</button>
            </form>
            <p onClick={() => setIsRegistering(!isRegistering)} className="switch-auth-text">
                {isRegistering ? 'Вже є акаунт? Увійти' : 'Немає акаунту? Створити'}
            </p>
        </div>
    );
}

export default Auth;