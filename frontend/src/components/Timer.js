import React, { useEffect, useRef } from 'react';

function Timer({
                   settings, stage, setStage, minutes, setMinutes,
                   seconds, setSeconds, isActive, setIsActive,
                   completedCount, setCompletedCount, onSessionComplete,
                   activeTask, finishActiveTask // Додані нові пропси
               }) {
    const audioRef = useRef(new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg'));

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                } else if (seconds === 0) {
                    if (minutes === 0) {
                        handleTransition();
                        clearInterval(interval);
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                }
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, minutes, seconds, stage]);

    const handleTransition = () => {
        setIsActive(false);
        audioRef.current.play().catch(() => {});

        if (stage === 'focus') {
            const nextCount = completedCount + 1;
            setCompletedCount(nextCount);
            onSessionComplete(settings.focusTime);

            if (nextCount % settings.longBreakInterval === 0) {
                setStage('long_break');
                setMinutes(settings.longBreak);
            } else {
                setStage('short_break');
                setMinutes(settings.shortBreak);
            }
        } else {
            setStage('focus');
            setMinutes(settings.focusTime);
        }
        setSeconds(0);
    };

    const reset = () => {
        setIsActive(false);
        setStage('focus');
        setMinutes(settings.focusTime);
        setSeconds(0);
    };

    const format = (num) => String(num).padStart(2, '0');
    const getLabel = () => stage === 'focus' ? 'Time to focus!' : stage === 'short_break' ? 'Short break!' : 'Long break!';

    return (
        <div className="pomodoro-card">
            <div className="stage-badge" style={{ backgroundColor: stage === 'focus' ? '#e74c3c' : '#2ecc71' }}>
                {stage.toUpperCase()}
            </div>

            <h1 className="timer-display">{format(minutes)}:{format(seconds)} - {getLabel()}</h1>
            <p className="sub-text">Completed today: {completedCount}</p>

            {/* НОВИЙ БЛОК: Відображення активної задачі */}
            <div className="active-task-display" style={{ margin: '20px 0', padding: '15px', border: '1px dashed #bdc3c7', borderRadius: '8px' }}>
                {activeTask ? (
                    <>
                        <p style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>
                            <strong>🎯 Поточна задача:</strong> {activeTask.title}
                        </p>
                        <button
                            onClick={finishActiveTask}
                            className="control-btn"
                            style={{ backgroundColor: '#3498db', fontSize: '0.9rem', padding: '8px 15px', width: 'auto' }}
                        >
                            ✔ Завершити задачу
                        </button>
                    </>
                ) : (
                    <p style={{ margin: '0', opacity: 0.7 }}>Немає активної задачі (вільна сесія)</p>
                )}
            </div>
            {/* КІНЕЦЬ НОВОГО БЛОКУ */}

            <div className="buttons-grid">
                <button
                    onClick={() => setIsActive(!isActive)}
                    className="control-btn"
                    style={{ backgroundColor: isActive ? '#f39c12' : '#2ecc71' }}
                >
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button
                    onClick={reset}
                    className="control-btn"
                    style={{ backgroundColor: '#7f8c8d' }}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

export default Timer;