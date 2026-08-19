import { useState, useEffect, useCallback } from 'react';

export type TimerMode = 'focus' | 'break' | 'long-break';

const DEFAULT_FOCUS_TIME = 25 * 60;
const DEFAULT_BREAK_TIME = 5 * 60;
const DEFAULT_LONG_BREAK_TIME = 20 * 60;
const CYCLES_BEFORE_LONG_BREAK = 4;

export function usePomodoro(onComplete?: () => void) {
    const [mode, setMode] = useState<TimerMode>('focus');
    const [focusTime, setFocusTime] = useState(DEFAULT_FOCUS_TIME);
    const [breakTime, setBreakTime] = useState(DEFAULT_BREAK_TIME);
    const [longBreakTime, setLongBreakTime] = useState(DEFAULT_LONG_BREAK_TIME);
    const [timeLeft, setTimeLeft] = useState(DEFAULT_FOCUS_TIME);
    const [isActive, setIsActive] = useState(false);
    const [isAutoLoop, setIsAutoLoop] = useState(true);
    const [cycleCount, setCycleCount] = useState(0); // 完了した集中セッション数（0〜3）

    const getTimeForMode = useCallback((m: TimerMode) => {
        if (m === 'focus') return focusTime;
        if (m === 'break') return breakTime;
        return longBreakTime;
    }, [focusTime, breakTime, longBreakTime]);

    // 手動スキップ（次のモードへ）
    const switchMode = useCallback(() => {
        if (mode === 'focus') {
            const newCount = cycleCount + 1;
            setCycleCount(newCount);
            if (newCount >= CYCLES_BEFORE_LONG_BREAK) {
                setMode('long-break');
                setTimeLeft(longBreakTime);
            } else {
                setMode('break');
                setTimeLeft(breakTime);
            }
        } else {
            // break or long-break → focus
            if (mode === 'long-break') {
                setCycleCount(0);
            }
            setMode('focus');
            setTimeLeft(focusTime);
        }
        setIsActive(false);
    }, [mode, cycleCount, focusTime, breakTime, longBreakTime]);

    const toggleTimer = useCallback(() => {
        setIsActive(prev => !prev);
    }, []);

    const toggleAutoLoop = useCallback(() => {
        setIsAutoLoop(prev => !prev);
    }, []);

    const resetTimer = useCallback(() => {
        setTimeLeft(getTimeForMode(mode));
        setIsActive(false);
    }, [mode, getTimeForMode]);

    const adjustTime = useCallback((amount: number) => {
        if (mode === 'focus') {
            setFocusTime(prev => Math.max(60, prev + amount));
            setTimeLeft(prev => Math.max(0, prev + amount));
        } else if (mode === 'break') {
            setBreakTime(prev => Math.max(60, prev + amount));
            setTimeLeft(prev => Math.max(0, prev + amount));
        } else {
            setLongBreakTime(prev => Math.max(60, prev + amount));
            setTimeLeft(prev => Math.max(0, prev + amount));
        }
    }, [mode]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // タイマー終了
            if (onComplete) {
                onComplete();
            }

            if (isAutoLoop) {
                if (mode === 'focus') {
                    const newCount = cycleCount + 1;
                    setCycleCount(newCount);
                    if (newCount >= CYCLES_BEFORE_LONG_BREAK) {
                        // 4回目の集中 → Long Break
                        setMode('long-break');
                        setTimeLeft(longBreakTime);
                    } else {
                        // 1〜3回目の集中 → Short Break
                        setMode('break');
                        setTimeLeft(breakTime);
                    }
                } else if (mode === 'break') {
                    // Short Break → 次の集中へ
                    setMode('focus');
                    setTimeLeft(focusTime);
                } else {
                    // Long Break → サイクルリセットして集中へ
                    setCycleCount(0);
                    setMode('focus');
                    setTimeLeft(focusTime);
                }
                // isActive = true のまま継続
            } else {
                setIsActive(false);
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete, isAutoLoop, mode, cycleCount, focusTime, breakTime, longBreakTime]);

    return {
        mode,
        timeLeft,
        isActive,
        isAutoLoop,
        cycleCount,
        toggleTimer,
        resetTimer,
        switchMode,
        adjustTime,
        toggleAutoLoop,
        focusTime,
        breakTime,
        longBreakTime,
        progress: 1 - timeLeft / getTimeForMode(mode),
    };
}
