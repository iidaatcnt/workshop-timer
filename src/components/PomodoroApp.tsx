'use client';

import { usePomodoro } from '@/hooks/usePomodoro';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw, SkipForward, Coffee, MessageCircle } from 'lucide-react';

export function PomodoroApp() {
    const { mode, timeLeft, isActive, toggleTimer, resetTimer, switchMode, progress } = usePomodoro();

    // Format time mm:ss
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // Dynamic Styles based on mode
    const isFocus = mode === 'focus';

    return (
        <div className={cn(
            "min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-700 ease-in-out",
            isFocus ? "bg-zinc-950 text-emerald-400" : "bg-orange-50 text-orange-600"
        )}>

            {/* Title / Header */}
            <header className="absolute top-8 text-center space-y-2">
                <h1 className="text-3xl font-black tracking-widest uppercase">
                    {isFocus ? "MOKUMOKU TIME" : "CHAT TIME"}
                </h1>
                <p className={cn("text-sm font-medium opacity-70", isFocus ? "text-emerald-200" : "text-orange-400")}>
                    {isFocus ? "Focus on your LINE Stickers!" : "Take a break & Chat!"}
                </p>
            </header>

            {/* Main Timer Circle */}
            <div className="relative group">
                {/* Decorative Ring */}
                <div className={cn(
                    "absolute -inset-4 rounded-full blur-xl opacity-30 transition-all duration-1000",
                    isActive ? "scale-110" : "scale-100",
                    isFocus ? "bg-emerald-500" : "bg-orange-500"
                )} />

                <div className={cn(
                    "relative w-72 h-72 rounded-full border-8 flex items-center justify-center bg-transparent z-10 transition-all duration-500",
                    isFocus ? "border-emerald-900 bg-zinc-900/50" : "border-orange-200 bg-white/50"
                )}>
                    <span className="text-6xl font-black tabular-nums tracking-tighter">
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-12 flex items-center gap-6">
                <button
                    onClick={toggleTimer}
                    className={cn(
                        "p-6 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 font-bold text-lg",
                        isFocus
                            ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/40"
                            : "bg-orange-500 text-white hover:bg-orange-400 shadow-orange-200"
                    )}
                >
                    {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    {isActive ? "PAUSE" : "START"}
                </button>

                <button
                    onClick={resetTimer}
                    className={cn(
                        "p-4 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/10",
                        isFocus ? "text-emerald-500" : "text-orange-500"
                    )}
                    title="Reset"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>

                <button
                    onClick={switchMode}
                    className={cn(
                        "p-4 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2 font-medium",
                        isFocus ? "text-emerald-500" : "text-orange-500"
                    )}
                    title={isFocus ? "Switch to Chat" : "Switch to Focus"}
                >
                    <SkipForward className="w-6 h-6" />
                    <span className="uppercase text-xs tracking-wide">
                        {isFocus ? "Break" : "Focus"}
                    </span>
                </button>
            </div>

            {/* Footer Info */}
            <div className={cn(
                "absolute bottom-8 flex gap-8 opacity-50 text-sm font-medium",
                isFocus ? "text-zinc-500" : "text-orange-300"
            )}>
                <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4" /> Mokumoku 25m
                </div>
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Chat 5m
                </div>
            </div>

        </div>
    );
}
