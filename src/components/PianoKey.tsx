import { cn } from '@/lib/utils';
import type { PianoKey as PianoKeyType } from '@/hooks/usePiano';

interface PianoKeyProps {
  pianoKey: PianoKeyType;
  isActive: boolean;
  onPlay: (note: string) => void;
  onStop: (note: string) => void;
  style?: React.CSSProperties;
}

export function PianoKey({ pianoKey, isActive, onPlay, onStop, style }: PianoKeyProps) {
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

  if (pianoKey.isBlack) {
    return (
      <div
        className={cn('black-key', isActive && 'active')}
        style={style}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground opacity-60">
          {pianoKey.keyLabel}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn('white-key', isActive && 'active')}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground">
        {pianoKey.keyLabel}
      </span>
    </div>
  );
}
