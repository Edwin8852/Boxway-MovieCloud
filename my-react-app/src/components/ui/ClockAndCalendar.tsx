import React, { useState, useEffect, useRef } from 'react';
import { Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const ClockAndCalendar: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date()); // For calendar navigation
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const padding = Array.from({ length: firstDayOfMonth }, (_) => null);

    const changeMonth = (offset: number) => {
        setViewDate(new Date(currentYear, currentMonth + offset, 1));
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();
    };

    return (
        <div className="relative" ref={containerRef}>
            {/* Compact Trigger */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setViewDate(new Date()); // Reset to current month when opening
                }}
                className={`
                    flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300
                    ${isOpen
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[0.98]'
                        : 'bg-card/40 backdrop-blur-md border-border/50 text-foreground hover:border-primary/50 hover:bg-card/60'}
                `}
            >
                <div className="flex items-center gap-2">
                    <Clock className={`w-3.5 h-3.5 ${isOpen ? 'text-primary-foreground' : 'text-primary'}`} />
                    <span className="text-[13px] font-bold tabular-nums tracking-tight">
                        {formatTime(time)}
                    </span>
                </div>
                <div className="w-px h-3 bg-border/50" />
                <div className="flex items-center gap-2">
                    <CalendarIcon className={`w-3.5 h-3.5 ${isOpen ? 'text-primary-foreground' : 'text-secondary'}`} />
                    <span className="text-[11px] font-semibold opacity-80 whitespace-nowrap">
                        {formatDate(time)}
                    </span>
                </div>
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex flex-col sm:flex-row gap-3 p-1 bg-[#F6EFE6]/95 backdrop-blur-2xl border border-white/20 rounded-[1.5rem] shadow-2xl">
                        {/* Time Display Card */}
                        <div className="min-w-[180px] bg-white/40 border border-white/50 rounded-2xl p-4 shadow-sm relative group overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-[60px]" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Clock className="w-3 h-3 text-primary" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/60">Precise Sync</span>
                                </div>
                                <h2 className="text-3xl font-display font-black text-foreground tracking-tighter tabular-nums leading-none">
                                    {time.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                                </h2>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-2 border-t border-black/5 pt-2">
                                    {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Mini Calendar Card */}
                        <div className="w-[200px] bg-white/40 border border-white/50 rounded-2xl p-4 shadow-sm relative group overflow-hidden">
                            <div className="absolute top-0 left-0 -ml-16 -mt-16 w-48 h-48 bg-secondary/10 rounded-full blur-[50px]" />
                            <div className="relative z-10 text-[#1F1F1F]">
                                <div className="flex items-center justify-between mb-3 border-b border-black/5 pb-2">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                                        <CalendarIcon className="w-3 h-3 text-secondary" />
                                        {viewDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                    </h3>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); changeMonth(-1); }}
                                            className="p-1 rounded-md hover:bg-black/10 transition-colors active:scale-90"
                                            title="Previous Month"
                                        >
                                            <ChevronLeft className="w-4 h-4 text-primary" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); changeMonth(1); }}
                                            className="p-1 rounded-md hover:bg-black/10 transition-colors active:scale-90"
                                            title="Next Month"
                                        >
                                            <ChevronRight className="w-4 h-4 text-primary" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                                        <span key={`${day}-${idx}`} className="text-[8px] font-black text-black/30 uppercase">{day}</span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-1">
                                    {[...padding, ...days].map((day, ix) => (
                                        <div
                                            key={ix}
                                            onClick={(e) => {
                                                if (day) {
                                                    e.stopPropagation();
                                                    // Potential day-click popup logic here
                                                    console.log(`Clicked day: ${day} of month: ${currentMonth}`);
                                                }
                                            }}
                                            className={`
                                                aspect-square flex items-center justify-center text-[9px] font-black rounded-lg transition-all
                                                ${day && isToday(day)
                                                    ? 'bg-primary text-primary-foreground shadow-lg scale-110 z-10'
                                                    : day
                                                        ? 'text-foreground/80 hover:bg-black/10 hover:text-foreground cursor-pointer active:scale-95'
                                                        : 'opacity-0'}
                                            `}
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClockAndCalendar;
