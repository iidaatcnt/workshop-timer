'use client';

import { usePomodoro } from '@/hooks/usePomodoro';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw, SkipForward, Leaf, Coffee, ChefHat, MessageCircle, Plus, Minus } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';

export function PomodoroApp() {
    const playAlarm = useCallback(() => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const oscillators = [
                { freq: 880, start: 0, end: 0.1 },
                { freq: 1108.73, start: 0.1, end: 0.6 }
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

    const playCountdown = useCallback(() => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {
            console.error("Audio play failed", e);
        }
    }, []);

    const { mode, timeLeft, isActive, isAutoLoop, cycleCount, toggleAutoLoop, toggleTimer, resetTimer, switchMode, adjustTime, focusTime, breakTime, longBreakTime } = usePomodoro(playAlarm);

    useEffect(() => {
        if (isActive && timeLeft > 0 && timeLeft <= 3) {
            playCountdown();
        }
    }, [timeLeft, isActive, playCountdown]);

    const [message, setMessage] = useState("ヤルまたはめちゃヤル");

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const isFocus = mode === 'focus';
    const isLongBreak = mode === 'long-break';
    const isBreak = mode === 'break';

    const renderCycleDots = () => {
        return Array.from({ length: 4 }, (_, i) => (
            <span key={i} className={cn("text-base transition-all", i < cycleCount ? "opacity-100" : "opacity-25")}>
                🍅
            </span>
        ));
    };

    return (
        <div className={cn(
            "min-h-screen w-full flex flex-col items-center justify-center py-12 transition-colors duration-700 ease-in-out font-sans overflow-y-auto",
            isFocus ? "bg-[#FFF0EB]" : isLongBreak ? "bg-[#EEF2FF]" : "bg-[#F0FDF4]"
        )}>

            <header className="z-20 text-center space-y-4 mb-12">
                <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm mb-1 transition-colors",
                    isFocus ? "bg-red-100 text-red-700" : isLongBreak ? "bg-indigo-100 text-indigo-700" : "bg-green-100 text-green-700"
                )}>
                    {isFocus ? <ChefHat className="w-4 h-4" /> : isLongBreak ? <Coffee className="w-4 h-4" /> : <Leaf className="w-4 h-4" />}
                    <span>{isFocus ? "Let's Cook!" : isLongBreak ? "Long Rest!" : "Bon Appétit"}</span>
                </div>
                <h1 className={cn(
                    "text-4xl md:text-5xl font-black tracking-tight",
                    isFocus ? "text-red-600" : isLongBreak ? "text-indigo-600" : "text-green-600"
                )}>
                    {isFocus ? "POMODORO" : isLongBreak ? "LONG BREAK" : "BASIL BREAK"}
                </h1>
                <p className={cn(
                    "font-medium mb-4",
                    isFocus ? "text-red-400" : isLongBreak ? "text-indigo-400" : "text-green-500"
                )}>
                    {isFocus ? "美味しい時間を育てましょう 🍅" : isLongBreak ? "しっかり休んでエネルギーチャージ ☕" : "少し休憩してリフレッシュ 🌿"}
                </p>

                <div className="relative max-w-[300px] mx-auto group">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="メッセージを入力..."
                        className={cn(
                            "w-full bg-white/50 backdrop-blur-md border-2 rounded-xl px-4 py-2 pl-10 text-center font-bold transition-all outline-none focus:ring-2",
                            isFocus
                                ? "border-red-200 text-red-700 focus:ring-red-400 focus:border-red-400"
                                : isLongBreak
                                ? "border-indigo-200 text-indigo-700 focus:ring-indigo-400 focus:border-indigo-400"
                                : "border-green-200 text-green-700 focus:ring-green-400 focus:border-green-400"
                        )}
                    />
                    <MessageCircle className={cn(
                        "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
                        isFocus ? "text-red-400" : isLongBreak ? "text-indigo-400" : "text-green-400"
                    )} />
                </div>
            </header>

            <div className="relative z-10 flex items-center justify-center gap-4 md:gap-8">
                <button
                    onClick={() => adjustTime(-60)}
                    className={cn(
                        "p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-90 border-2 bg-white",
                        isFocus ? "text-red-500 border-red-100" : isLongBreak ? "text-indigo-500 border-indigo-100" : "text-green-500 border-green-100"
                    )}
                    aria-label="Decrease time"
                >
                    <Minus className="w-6 h-6 md:w-8 md:h-8" />
                </button>

                <div className="relative">
                    {/* ヘタ装飾：Long Break時は非表示 */}
                    {!isLongBreak && (
                        <div className={cn(
                            "absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 z-20 transition-all duration-700 origin-bottom",
                            isFocus ? "rotate-0 scale-100" : "rotate-12 scale-90 opacity-80"
                        )}>
                            <svg viewBox="0 0 100 100" className="fill-green-500 drop-shadow-sm">
                                <path d="M50 50 Q70 10 90 30 T50 50 Q30 90 10 70 T50 50" />
                                <path d="M50 50 Q30 10 10 30 T50 50 Q70 90 90 70 T50 50" />
                            </svg>
                        </div>
                    )}

                    <div className={cn(
                        "relative w-72 h-72 md:w-80 md:h-80 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-700 border-4 overflow-hidden",
                        isFocus
                            ? "bg-red-500 border-red-600 shadow-red-200"
                            : isLongBreak
                            ? "border-indigo-300 shadow-indigo-200"
                            : "bg-green-500 border-green-600 shadow-green-200"
                    )}>
                        {/* Long Break: 画像を円の背景に */}
                        {isLongBreak && (
                            <img
                                src="/teatime.jpg"
                                alt="British Tea Time"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        )}
                        {/* 光沢エフェクト */}
                        {!isLongBreak && (
                            <div className="absolute top-4 left-4 w-1/3 h-1/3 rounded-full bg-gradient-to-br from-white/40 to-transparent blur-sm" />
                        )}
                        {/* Long Break時は文字を読みやすくする半透明オーバーレイ */}
                        {isLongBreak && (
                            <div className="absolute inset-0 bg-indigo-900/40" />
                        )}
                        <span className="text-7xl md:text-8xl font-black tracking-tighter text-white drop-shadow-md z-10 tabular-nums">
                            {formatTime(timeLeft)}
                        </span>
                        <span className="text-white/90 font-bold uppercase tracking-widest mt-2 z-10 text-sm drop-shadow-md">
                            {isActive ? (isFocus ? "Cooking..." : "Resting...") : "Ready?"}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => adjustTime(60)}
                    className={cn(
                        "p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-90 border-2 bg-white",
                        isFocus ? "text-red-500 border-red-100" : isLongBreak ? "text-indigo-500 border-indigo-100" : "text-green-500 border-green-100"
                    )}
                    aria-label="Increase time"
                >
                    <Plus className="w-6 h-6 md:w-8 md:h-8" />
                </button>
            </div>

            <div className="mt-12 flex items-center gap-6 z-20">
                <button
                    onClick={toggleTimer}
                    className={cn(
                        "h-20 w-20 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center border-4 border-white",
                        isFocus
                            ? "bg-red-600 text-white hover:bg-red-700 shadow-red-300"
                            : isLongBreak
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-300"
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
                            isFocus ? "text-red-600 bg-white/30" : isLongBreak ? "text-indigo-600 bg-white/30" : "text-green-600 bg-white/30"
                        )}
                        title="Reset"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>
                    <button
                        onClick={switchMode}
                        className={cn(
                            "p-3 rounded-2xl transition-colors hover:bg-white/50 backdrop-blur-sm shadow-sm",
                            isFocus ? "text-red-600 bg-white/30" : isLongBreak ? "text-indigo-600 bg-white/30" : "text-green-600 bg-white/30"
                        )}
                        title="Skip"
                    >
                        <SkipForward className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className={cn(
                "mt-16 flex flex-col items-center gap-4 font-medium text-sm transition-colors",
                isFocus ? "text-red-400" : isLongBreak ? "text-indigo-400" : "text-green-400"
            )}>
                <div className="flex items-center gap-1">
                    {renderCycleDots()}
                </div>

                <div className="flex items-center gap-6 flex-wrap justify-center">
                    <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", isFocus ? "bg-red-500" : "bg-red-200")} />
                        Pomodoro {Math.floor(focusTime / 60)}m
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", isBreak ? "bg-green-500" : "bg-green-200")} />
                        Break {Math.floor(breakTime / 60)}m
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", isLongBreak ? "bg-indigo-500" : "bg-indigo-200")} />
                        Long Break {Math.floor(longBreakTime / 60)}m
                    </div>

                    <div className="flex items-center gap-2 ml-2 sm:ml-4">
                        <button
                            onClick={toggleAutoLoop}
                            className={cn(
                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shadow-inner",
                                isAutoLoop
                                    ? (isFocus ? "bg-red-500" : isLongBreak ? "bg-indigo-500" : "bg-green-500")
                                    : "bg-black/10"
                            )}
                            aria-label="Toggle Auto Loop"
                        >
                            <span className={cn(
                                "inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out",
                                isAutoLoop ? "translate-x-6" : "translate-x-1"
                            )} />
                        </button>
                        <span className="font-bold opacity-80 uppercase tracking-wider text-xs">Loop</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
