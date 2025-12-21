import { useState, useEffect, useCallback } from 'react';

export type TimerMode = 'focus' | 'break';

const FOCUS_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60;  // 5 minutes

export function usePomodoro(onComplete?: () => void) {
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
    const [isActive, setIsActive] = useState(false);

    // Switch modes automatically or manually
    const switchMode = useCallback(() => {
        const nextMode = mode === 'focus' ? 'break' : 'focus';
        setMode(nextMode);
        setTimeLeft(nextMode === 'focus' ? FOCUS_TIME : BREAK_TIME);
        setIsActive(false);
    }, [mode]);

    const toggleTimer = useCallback(() => {
        setIsActive(!isActive);
    }, [isActive]);

    const resetTimer = useCallback(() => {
        setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
        setIsActive(false);
    }, [mode]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer finished naturally
            setIsActive(false);
            if (onComplete) {
                onComplete();
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete]);

    return {
        mode,
        timeLeft,
        isActive,
        toggleTimer,
        resetTimer,
        switchMode,
        progress: 1 - timeLeft / (mode === 'focus' ? FOCUS_TIME : BREAK_TIME)
    };
}
