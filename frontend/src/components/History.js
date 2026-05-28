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
                    <span>🎯 Фокус</span>
                    <span style={{ color: '#bdc3c7' }}>{item.duration} хв — {new Date(item.date).toLocaleDateString()}</span>
                </div>
            ))
            )}
        </div>
            <button onClick={onBack} className="primary-btn">Назад</button>
        </div>
    );
}

export default History;