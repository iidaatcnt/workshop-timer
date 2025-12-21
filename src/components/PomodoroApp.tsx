'use client';

import { usePomodoro } from '@/hooks/usePomodoro';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw, SkipForward, Utensils, Leaf, ChefHat } from 'lucide-react';
import { useCallback } from 'react';

export function PomodoroApp() {
    // Sound Effect using Web Audio API
    const playAlarm = useCallback(() => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const oscillators = [
                { freq: 880, start: 0, end: 0.1 },  // High Ding
                { freq: 1108.73, start: 0.1, end: 0.6 } // Higher Ding (C#6)
            ];

            oscillators.forEach(({ freq, start, end }) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

                gain.gain.setValueAtTime(0, ctx.currentTime + start);
                gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + start + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + end);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(ctx.currentTime + start);
                osc.stop(ctx.currentTime + end);
            });
        } catch (e) {
            console.error("Audio play failed", e);
        }
    }, []);

    const { mode, timeLeft, isActive, toggleTimer, resetTimer, switchMode } = usePomodoro(playAlarm);

    // Format time mm:ss
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // Theme: Tomato (Red) vs Basil (Green)
    const isFocus = mode === 'focus';

    return (
        <div className={cn(
            "min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-700 ease-in-out font-sans overflow-hidden",
            isFocus ? "bg-[#FFF0EB]" : "bg-[#F0FDF4]" // Very light red vs light green
        )}>

            {/* Header */}
            <header className="absolute top-8 md:top-12 z-20 text-center space-y-2">
                <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm mb-1 transition-colors",
                    isFocus ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                )}>
                    {isFocus ? <ChefHat className="w-4 h-4" /> : <Leaf className="w-4 h-4" />}
                    <span>{isFocus ? "Let's Cook!" : "Bon Appétit"}</span>
                </div>
                <h1 className={cn(
                    "text-4xl md:text-5xl font-black tracking-tight",
                    isFocus ? "text-red-600" : "text-green-600"
                )}>
                    {isFocus ? "POMODORO" : "BASIL BREAK"}
                </h1>
                <p className={cn(
                    "font-medium",
                    isFocus ? "text-red-400" : "text-green-500"
                )}>
                    {isFocus ? "美味しい時間を育てましょう �" : "少し休憩してリフレッシュ 🌿"}
                </p>
            </header>

            {/* Main Timer (The Tomato) */}
            <div className="relative z-10 mt-16 md:mt-0">

                {/* Cute Leaf Decoration on top of the tomato */}
                <div className={cn(
                    "absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 z-20 transition-all duration-700 origin-bottom",
                    isFocus ? "rotate-0 scale-100" : "rotate-12 scale-90 opacity-80"
                )}>
                    <svg viewBox="0 0 100 100" className="fill-green-500 drop-shadow-sm">
                        <path d="M50 50 Q70 10 90 30 T50 50 Q30 90 10 70 T50 50" />
                        <path d="M50 50 Q30 10 10 30 T50 50 Q70 90 90 70 T50 50" />
                    </svg>
                </div>

                <div className={cn(
                    "relative w-72 h-72 md:w-80 md:h-80 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-700 border-4",
                    isFocus
                        ? "bg-red-500 border-red-600 shadow-red-200"
                        : "bg-green-500 border-green-600 shadow-green-200"
                )}>
                    {/* Glossy reflection for tomato effect */}
                    <div className="absolute top-4 left-4 w-1/3 h-1/3 rounded-full bg-gradient-to-br from-white/40 to-transparent blur-sm" />

                    <span className="text-7xl md:text-8xl font-black tracking-tighter text-white drop-shadow-md z-10 tabular-nums">
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-white/80 font-bold uppercase tracking-widest mt-2 z-10 text-sm">
                        {isActive ? (isFocus ? "Cooking..." : "Resting...") : "Ready?"}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-12 flex items-center gap-6 z-20">
                <button
                    onClick={toggleTimer}
                    className={cn(
                        "h-20 w-20 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center border-4 border-white",
                        isFocus
                            ? "bg-red-600 text-white hover:bg-red-700 shadow-red-300"
                            : "bg-green-600 text-white hover:bg-green-700 shadow-green-300"
                    )}
                >
                    {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={resetTimer}
                        className={cn(
                            "p-3 rounded-2xl transition-colors hover:bg-white/50 backdrop-blur-sm shadow-sm",
                            isFocus ? "text-red-600 bg-white/30" : "text-green-600 bg-white/30"
                        )}
                        title="Reset"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>

                    <button
                        onClick={switchMode}
                        className={cn(
                            "p-3 rounded-2xl transition-colors hover:bg-white/50 backdrop-blur-sm shadow-sm",
                            isFocus ? "text-red-600 bg-white/30" : "text-green-600 bg-white/30"
                        )}
                        title="Skip"
                    >
                        <SkipForward className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className={cn(
                "absolute bottom-8 flex gap-8 font-medium text-sm transition-colors",
                isFocus ? "text-red-400" : "text-green-400"
            )}>
                <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", isFocus ? "bg-red-500" : "bg-red-200")} />
                    Pomodoro 25m
                </div>
                <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", !isFocus ? "bg-green-500" : "bg-green-200")} />
                    Break 5m
                </div>
            </div>

        </div>
    );
}
