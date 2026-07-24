import type { PianoKey as PianoKeyType } from '@/hooks/usePiano';
import { CircularPianoKey } from './CircularPianoKey';
import { Song } from '@/data/songs';

interface CircularPianoProps {
  whiteKeys: PianoKeyType[];
  activeKeys: Set<string>;
  isLoaded: boolean;
  playNote: (note: string) => void;
  stopNote: (note: string) => void;
  currentSong: Song | null;
  isPlayingSong: boolean;
}

export function CircularPiano({ whiteKeys, activeKeys, isLoaded, playNote, stopNote, currentSong, isPlayingSong }: CircularPianoProps) {
  // Extract rows based on the current mappings in usePiano (3 octaves, 7 keys each)
  // whiteKeys has 21 keys:
  // 0-6: Octave 3 (Z row) -> Bottom Row in UI
  // 7-13: Octave 4 (A row) -> Middle Row in UI
  // 14-20: Octave 5 (Q row) -> Top Row in UI
  
  const bottomRowKeys = whiteKeys.slice(0, 7);
  const middleRowKeys = whiteKeys.slice(7, 14);
  const topRowKeys = whiteKeys.slice(14, 21);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-10 px-6 sm:py-12 sm:px-8 rounded-[2.5rem] bg-gradient-to-b from-[#1a1a1a]/80 via-[#111]/80 to-black/90 backdrop-blur-md shadow-2xl ring-1 ring-white/10 overflow-hidden">
      


      {!isLoaded && <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 text-white font-display text-xl backdrop-blur-sm">Loading Sounds...</div>}

      <div className="relative z-10 flex flex-col gap-4 sm:gap-6 md:gap-7 w-full items-center perspective-1000">
        
        {/* Top Row (Octave 5) */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center transform-gpu -translate-y-2 scale-95 opacity-90">
          {topRowKeys.map((key, i) => (
            <CircularPianoKey
              key={key.note}
              pianoKey={key}
              numberLabel={(i + 1).toString()}
              isActive={activeKeys.has(key.note)}
              onPlay={playNote}
              onStop={stopNote}
            />
          ))}
        </div>
        
        {/* Middle Row (Octave 4) */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center">
          {middleRowKeys.map((key, i) => (
            <CircularPianoKey
              key={key.note}
              pianoKey={key}
              numberLabel={(i + 1).toString()}
              isActive={activeKeys.has(key.note)}
              onPlay={playNote}
              onStop={stopNote}
            />
          ))}
        </div>

        {/* Bottom Row (Octave 3) */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center transform-gpu translate-y-2 scale-105">
          {bottomRowKeys.map((key, i) => (
            <CircularPianoKey
              key={key.note}
              pianoKey={key}
              numberLabel={(i + 1).toString()}
              isActive={activeKeys.has(key.note)}
              onPlay={playNote}
              onStop={stopNote}
            />
          ))}
        </div>

      </div>

      {/* Decorative Light Beams */}
      <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-blue-500/10 blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-0 right-1/4 w-1/3 h-1/3 bg-purple-500/10 blur-[80px] pointer-events-none mix-blend-screen" />
    </div>
  );
}
