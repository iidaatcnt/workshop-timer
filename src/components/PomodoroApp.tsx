'use client';

import { usePomodoro } from '@/hooks/usePomodoro';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw, SkipForward, Coffee, MessageCircle, Heart, Sparkles } from 'lucide-react';

export function PomodoroApp() {
    const { mode, timeLeft, isActive, toggleTimer, resetTimer, switchMode, progress } = usePomodoro();

    // Format time mm:ss
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // Dynamic Styles based on mode
    // Focus (Mokumoku) = Mint Green / Teal (Calm, Concentration)
    // Chat (Break) = Soft Pink / Rose (Warm, Love, Relax)
    const isFocus = mode === 'focus';

    return (
        <div className={cn(
            "min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-700 ease-in-out font-sans",
            isFocus ? "bg-teal-50" : "bg-rose-50"
        )}>

            {/* Title / Header */}
            <header className="absolute top-12 text-center space-y-3 z-10">
                <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm mb-2",
                    isFocus ? "bg-teal-100 text-teal-700" : "bg-rose-100 text-rose-700"
                )}>
                    {isFocus ? <Sparkles className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                    <span>{isFocus ? "Do your best!" : "Relax time"}</span>
                </div>
                <h1 className={cn(
                    "text-4xl md:text-5xl font-bold tracking-tight drop-shadow-sm",
                    isFocus ? "text-teal-800" : "text-rose-800"
                )}>
                    {isFocus ? "Mokumoku Time" : "Chat Time"}
                </h1>
                <p className={cn("text-base font-medium opacity-80", isFocus ? "text-teal-600" : "text-rose-600")}>
                    {isFocus ? "集中してがんばろう 🌿" : "ゆっくりおしゃべり ☕️"}
                </p>
            </header>

            {/* Main Timer Circle */}
            <div className="relative group mt-8">
                {/* Decorative Ring / Bloom Effect */}
                <div className={cn(
                    "absolute -inset-6 rounded-full blur-2xl opacity-60 transition-all duration-1000",
                    isActive ? "scale-110" : "scale-100",
                    isFocus ? "bg-teal-200" : "bg-rose-200"
                )} />

                <div className={cn(
                    "relative w-72 h-72 md:w-80 md:h-80 rounded-full border-[10px] flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500",
                    isFocus 
                        ? "border-teal-100 bg-white" 
                        : "border-rose-100 bg-white"
                )}>
                    <span className={cn(
                        "text-7xl md:text-8xl font-black tabular-nums tracking-tighter transition-colors",
                        isFocus ? "text-teal-500" : "text-rose-400"
                    )}>
                        {formatTime(timeLeft)}
                    </span>
                    <span className={cn(
                        "mt-2 text-sm font-bold uppercase tracking-widest opacity-40",
                        isFocus ? "text-teal-400" : "text-rose-400"
                    )}>
                        {isActive ? "Running" : "Paused"}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-12 flex items-center gap-6 z-10">
                <button
                    onClick={toggleTimer}
                    className={cn(
                        "h-20 w-20 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 flex items-center justify-center",
                        isFocus
                            ? "bg-teal-400 text-white hover:bg-teal-500 shadow-teal-200"
                            : "bg-rose-400 text-white hover:bg-rose-500 shadow-rose-200"
                    )}
                >
                    {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={resetTimer}
                        className={cn(
                            "p-3 rounded-2xl transition-colors hover:bg-white/50 backdrop-blur-sm",
                            isFocus ? "text-teal-600 hover:text-teal-800" : "text-rose-600 hover:text-rose-800"
                        )}
                        title="Reset"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>
                    
                    <button
                        onClick={switchMode}
                        className={cn(
                            "p-3 rounded-2xl transition-colors hover:bg-white/50 backdrop-blur-sm",
                            isFocus ? "text-teal-600 hover:text-teal-800" : "text-rose-600 hover:text-rose-800"
                        )}
                        title="Skip"
                    >
                        <SkipForward className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Footer / Status */}
            <div className={cn(
                "absolute bottom-10 flex gap-6 px-6 py-3 rounded-full bg-white/40 backdrop-blur-md shadow-sm border border-white/50",
                isFocus ? "text-teal-700" : "text-rose-700"
            )}>
                <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", isFocus ? "bg-teal-400" : "bg-gray-300")} />
                    <span className="text-xs font-bold">Moku 25m</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", !isFocus ? "bg-rose-400" : "bg-gray-300")} />
                    <span className="text-xs font-bold">Chat 5m</span>
                </div>
            </div>

        </div>
    );
}
