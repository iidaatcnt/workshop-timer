import { useState, useEffect, useCallback } from 'react';

export type TimerMode = 'focus' | 'break';

const DEFAULT_FOCUS_TIME = 25 * 60;
const DEFAULT_BREAK_TIME = 5 * 60;

export function usePomodoro(onComplete?: () => void) {
    const [mode, setMode] = useState<TimerMode>('focus');
    const [focusTime, setFocusTime] = useState(DEFAULT_FOCUS_TIME);
    const [breakTime, setBreakTime] = useState(DEFAULT_BREAK_TIME);
    const [timeLeft, setTimeLeft] = useState(DEFAULT_FOCUS_TIME);
    const [isActive, setIsActive] = useState(false);
    const [isAutoLoop, setIsAutoLoop] = useState(false);

    // Switch modes automatically or manually
    const switchMode = useCallback(() => {
        const nextMode = mode === 'focus' ? 'break' : 'focus';
        setMode(nextMode);
        setTimeLeft(nextMode === 'focus' ? focusTime : breakTime);
        setIsActive(false);
    }, [mode, focusTime, breakTime]);

    const toggleTimer = useCallback(() => {
        setIsActive(!isActive);
    }, [isActive]);

    const toggleAutoLoop = useCallback(() => {
        setIsAutoLoop(prev => !prev);
    }, []);

    const resetTimer = useCallback(() => {
        setTimeLeft(mode === 'focus' ? focusTime : breakTime);
        setIsActive(false);
    }, [mode, focusTime, breakTime]);

    const adjustTime = useCallback((amount: number) => {
        if (mode === 'focus') {
            setFocusTime(prev => {
                const updated = Math.max(60, prev + amount);
                return updated;
            });
            // Also adjust current timeLeft to reflect the change immediately
            setTimeLeft(prev => Math.max(0, prev + amount));
        } else {
            setBreakTime(prev => {
                const updated = Math.max(60, prev + amount);
                return updated;
            });
            setTimeLeft(prev => Math.max(0, prev + amount));
        }
    }, [mode]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer finished naturally
            if (onComplete) {
                onComplete();
            }

            if (isAutoLoop) {
                const nextMode = mode === 'focus' ? 'break' : 'focus';
                setMode(nextMode);
                setTimeLeft(nextMode === 'focus' ? focusTime : breakTime);
                // Keep isActive = true to continue to the next session automatically
            } else {
                setIsActive(false);
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete, isAutoLoop, mode, focusTime, breakTime]);

    return {
        mode,
        timeLeft,
        isActive,
        isAutoLoop,
        toggleTimer,
        resetTimer,
        switchMode,
        adjustTime,
        toggleAutoLoop,
        focusTime,
        breakTime,
        progress: 1 - timeLeft / (mode === 'focus' ? focusTime : breakTime)
    };
}
