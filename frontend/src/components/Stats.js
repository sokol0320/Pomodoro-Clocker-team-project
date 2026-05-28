import React from 'react';

function Stats({ history, onBack }) {
    const getStats = () => {
        const todayStr = new Date().toDateString();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const todaySessions = history.filter(s => new Date(s.date).toDateString() === todayStr);
        const weekSessions = history.filter(s => new Date(s.date) >= oneWeekAgo);

        return {
            todayCount: todaySessions.length,
            todayMin: todaySessions.reduce((acc, s) => acc + s.duration, 0),
            weekCount: weekSessions.length,
            weekMin: weekSessions.reduce((acc, s) => acc + s.duration, 0)
            };
        };

    const stats = getStats();

    return (
        <div className="pomodoro-card">
            <h2 style={{ marginBottom: '25px' }}>Статистика продуктивності</h2>
            <div className="stats-grid">
                <div className="stat-box"><h3>{stats.todayCount}</h3><p>Сьогодні</p><small>{stats.todayMin} хв</small></div>
                <div className="stat-box"><h3>{stats.weekCount}</h3><p>За тиждень</p><small>{stats.weekMin} хв</small></div>
            </div>
                <button onClick={onBack} className="primary-btn">Назад</button>
            </div>
    );
}

export default Stats;