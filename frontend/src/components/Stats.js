import React from 'react';

function Stats({ history, onBack }) {
    // Для точної статистики продуктивності беремо лише сесії "focus"
    const focusSessions = history.filter(s => s.stage === 'focus' || !s.stage);

    const getStats = () => {
        const todayStr = new Date().toDateString();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const todaySessions = focusSessions.filter(s => new Date(s.date).toDateString() === todayStr);
        const weekSessions = focusSessions.filter(s => new Date(s.date) >= oneWeekAgo);

        return {
            todayCount: todaySessions.length,
            todayMin: todaySessions.reduce((acc, s) => acc + s.duration, 0),
            weekCount: weekSessions.length,
            weekMin: weekSessions.reduce((acc, s) => acc + s.duration, 0)
        };
    };

    // 1. Логіка: Найпродуктивніший день
    const getMostProductiveDay = () => {
        const days = {};
        focusSessions.forEach(session => {
            const date = new Date(session.date).toLocaleDateString('uk-UA');
            days[date] = (days[date] || 0) + session.duration;
        });

        if (Object.keys(days).length === 0) return 'Немає даних';
        const bestDay = Object.keys(days).reduce((a, b) => days[a] > days[b] ? a : b);
        return `${bestDay} (${days[bestDay]} хв)`;
    };

    // 2. Логіка: Статистика за тегами (задачами)
    const getTagStats = () => {
        const tags = {};
        focusSessions.forEach(session => {
            const tag = session.tag || 'Без задачі (вільно)';
            tags[tag] = (tags[tag] || 0) + session.duration;
        });
        return tags;
    };

    const stats = getStats();
    const bestDay = getMostProductiveDay();
    const tagStats = getTagStats();

    // Загальний час для розрахунку відсотків у графіку
    const totalFocusTime = focusSessions.reduce((acc, s) => acc + s.duration, 0) || 1;

    return (
        <div className="pomodoro-card stats-card" style={{ maxWidth: '550px' }}>
            <h2 style={{ marginBottom: '25px' }}>📊 Статистика продуктивності</h2>

            <div className="stats-grid">
                <div className="stat-box">
                    <h3>{stats.todayCount}</h3>
                    <p>Сьогодні</p>
                    <small>{stats.todayMin} хв</small>
                </div>
                <div className="stat-box">
                    <h3>{stats.weekCount}</h3>
                    <p>За тиждень</p>
                    <small>{stats.weekMin} хв</small>
                </div>
            </div>

            {/* Блок: Найпродуктивніший день */}
            <div className="stat-box" style={{ marginBottom: '25px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>🏆 Найпродуктивніший день</h3>
                <p style={{ margin: 0, color: '#e74c3c', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {bestDay}
                </p>
            </div>

            {/* Блок: Графік за задачами */}
            <div className="charts-container" style={{ textAlign: 'left', marginBottom: '25px' }}>
                <h3 style={{ marginBottom: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    Час за задачами
                </h3>

                {Object.keys(tagStats).length === 0 ? (
                    <p style={{ opacity: 0.6 }}>Немає даних по задачах.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {Object.entries(tagStats)
                            .sort((a, b) => b[1] - a[1]) // Сортування від найбільшого часу до найменшого
                            .map(([tag, time]) => (
                                <li key={tag} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ width: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem' }} title={tag}>
                                    {tag}
                                </span>
                                    <div style={{ flex: 1, backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', height: '14px', borderRadius: '8px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${Math.min((time / totalFocusTime) * 100, 100)}%`,
                                            backgroundColor: '#3498db',
                                            height: '100%',
                                            borderRadius: '8px'
                                        }} />
                                    </div>
                                    <span style={{ width: '55px', textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-sub)' }}>
                                    {time} хв
                                </span>
                                </li>
                            ))}
                    </ul>
                )}
            </div>

            {onBack && <button onClick={onBack} className="primary-btn">Назад</button>}
        </div>
    );
}

export default Stats;