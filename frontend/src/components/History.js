import React from 'react';

function History({ history, onBack }) {
    return (
        <div className="pomodoro-card">
            <h2 style={{ marginBottom: '20px' }}>Історія сесій</h2>
            <div className="history-list">
                {history.length === 0 ? (
                    <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>Історія порожня</p>
                ) : (
                    history.map(item => (
                        <div key={item.id} className="history-item">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>{item.stage === 'short_break' || item.stage === 'long_break' ? '☕ Перерва' : '🎯 Фокус'}</span>

                                {/* Відображення тегу задачі, якщо він є */}
                                {item.tag && (
                                    <span style={{
                                        fontSize: '0.75rem',
                                        backgroundColor: '#3498db',
                                        color: '#fff',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '120px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }} title={item.tag}>
                                        {item.tag}
                                    </span>
                                )}
                            </div>

                            <span style={{ color: '#bdc3c7' }}>
                                {item.duration} хв — {new Date(item.date).toLocaleDateString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
            <button onClick={onBack} className="primary-btn">Назад</button>
        </div>
    );
}

export default History;