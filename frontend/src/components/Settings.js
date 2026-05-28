import React from 'react';

function Settings({ settings, setSettings, onBack }) {
    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: Math.max(1, parseInt(value) || 1) }));
    };

    return (
        <div className="pomodoro-card">
        <h2 style={{ marginBottom: '20px' }}>Налаштування циклу</h2>
        {[['focusTime', 'Робота (хв):'], ['shortBreak', 'Коротка перерва (хв):'], ['longBreak', 'Довга перерва (хв):'], ['longBreakInterval', 'Помодорів до довгої перерви:']].map(([key, label]) => (
            <div key={key} className="settings-row">
                <label>{label}</label>
                <input type="number" value={settings[key]} onChange={e => handleChange(key, e.target.value)} className="settings-input" />
            </div>
        ))}
        <button onClick={onBack} className="primary-btn" style={{ marginTop: '15px' }}>Зберегти та повернутись</button>
        </div>
    );
}

export default Settings;