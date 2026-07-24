import { cn } from '@/lib/utils';
import type { PianoKey as PianoKeyType } from '@/hooks/usePiano';

interface CircularPianoKeyProps {
  pianoKey: PianoKeyType;
  numberLabel: string;
  isActive: boolean;
  onPlay: (note: string) => void;
  onStop: (note: string) => void;
}

export function CircularPianoKey({ pianoKey, numberLabel, isActive, onPlay, onStop }: CircularPianoKeyProps) {
  const handleMouseDown = () => onPlay(pianoKey.note);
  const handleMouseUp = () => onStop(pianoKey.note);
  const handleMouseLeave = () => {
    if (isActive) onStop(pianoKey.note);
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    onPlay(pianoKey.note);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    onStop(pianoKey.note);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-[5.5rem] md:h-[5.5rem] rounded-full transition-all duration-200 select-none cursor-pointer group",
        "bg-white/10 backdrop-blur-sm border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]",
        isActive ? "bg-white/30 border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.4)] scale-95" : "hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Outer decorative ring */}
      <div className={cn(
        "absolute inset-0 rounded-full border border-white/10 transition-all duration-300",
        isActive ? "scale-110 opacity-100" : "scale-100 opacity-0 group-hover:opacity-50"
      )} />
      
      {/* Inner subtle glow */}
      <div className={cn(
        "absolute inset-2 rounded-full bg-blue-400/20 blur-md transition-opacity duration-300",
        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-30"
      )} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <span className={cn(
          "text-2xl sm:text-3xl md:text-[2rem] leading-none font-light font-serif text-white transition-all duration-200",
          isActive ? "text-blue-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : ""
        )}>
          {numberLabel}
        </span>
        <span className="mt-1 px-2 py-0.5 rounded-sm bg-white/20 text-[9px] font-bold text-white tracking-widest uppercase">
          {pianoKey.keyLabel}
        </span>
      </div>
    </div>
  );
}
