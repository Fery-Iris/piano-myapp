import { PianoKey } from './PianoKey';
import type { PianoKey as PianoKeyType } from '@/hooks/usePiano';

// Black key positions - white key index where each black key sits
// Pattern per octave: C#(0), D#(1), F#(3), G#(4), A#(5)
const BLACK_KEY_POSITIONS = [
  // Octave 3 (white keys 0-6)
  { whiteKeyIndex: 0 }, // C#3
  { whiteKeyIndex: 1 }, // D#3
  { whiteKeyIndex: 3 }, // F#3
  { whiteKeyIndex: 4 }, // G#3
  { whiteKeyIndex: 5 }, // A#3
  // Octave 4 (white keys 7-13)
  { whiteKeyIndex: 7 }, // C#4
  { whiteKeyIndex: 8 }, // D#4
  { whiteKeyIndex: 10 }, // F#4
  { whiteKeyIndex: 11 }, // G#4
  { whiteKeyIndex: 12 }, // A#4
  // Octave 5 (white keys 14-20)
  { whiteKeyIndex: 14 }, // C#5
  { whiteKeyIndex: 15 }, // D#5
  { whiteKeyIndex: 17 }, // F#5
  { whiteKeyIndex: 18 }, // G#5
  { whiteKeyIndex: 19 }, // A#5
];

interface PianoProps {
  whiteKeys: PianoKeyType[];
  blackKeys: PianoKeyType[];
  activeKeys: Set<string>;
  isLoaded: boolean;
  playNote: (note: string) => void;
  stopNote: (note: string) => void;
}

export function Piano({ whiteKeys, blackKeys, activeKeys, isLoaded, playNote, stopNote }: PianoProps) {
  // Narrower keys for 3 octaves
  const whiteKeyWidth = 44; // px (was 60)
  const whiteKeyHeight = 180; // px (was 200)
  const blackKeyWidth = 28; // px (was 36)
  const blackKeyHeight = 110; // px (was 120)
  const keyGap = 2; // px

  return (
    <div className="piano-container">
      <div className="mb-4 text-center">
        <p className="text-xs text-muted-foreground">
          {isLoaded ? (
            <>
              <span className="hidden md:inline">Use keyboard: Z-M (low), A-J (mid), Q-U (high) | 1-5, 6-0, I-] for sharps</span>
              <span className="md:hidden">Tap keys to play • 3 octaves</span>
            </>
          ) : (
            'Loading...'
          )}
        </p>
      </div>
      
      {/* Scrollable container with hidden scrollbar */}
      <div className="piano-scroll-container relative mx-auto pb-4">
        <div
          className="relative flex"
          style={{
            height: whiteKeyHeight,
            width: whiteKeys.length * (whiteKeyWidth + keyGap) - keyGap,
          }}
        >
          {/* White Keys */}
          {whiteKeys.map((key, index) => (
            <PianoKey
              key={key.note}
              pianoKey={key}
              isActive={activeKeys.has(key.note)}
              onPlay={playNote}
              onStop={stopNote}
              style={{
                width: whiteKeyWidth,
                height: whiteKeyHeight,
                marginRight: index < whiteKeys.length - 1 ? keyGap : 0,
              }}
            />
          ))}
          
          {/* Black Keys */}
          {blackKeys.map((key, index) => {
            const position = BLACK_KEY_POSITIONS[index];
            const leftPosition = 
              position.whiteKeyIndex * (whiteKeyWidth + keyGap) + 
              (whiteKeyWidth - blackKeyWidth / 2);
            
            return (
              <PianoKey
                key={key.note}
                pianoKey={key}
                isActive={activeKeys.has(key.note)}
                onPlay={playNote}
                onStop={stopNote}
                style={{
                  width: blackKeyWidth,
                  height: blackKeyHeight,
                  left: leftPosition,
                  top: 0,
                }}
              />
            );
          })}
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground/60">
          Tip: Hold multiple keys for chords
        </p>
      </div>
    </div>
  );
}
