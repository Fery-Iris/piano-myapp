import { usePiano } from '@/hooks/usePiano';
import { PianoKey } from './PianoKey';

// Black key positions relative to white keys (percentage from left of white key)
const BLACK_KEY_POSITIONS = [
  { whiteKeyIndex: 0, offset: 65 }, // C#
  { whiteKeyIndex: 1, offset: 65 }, // D#
  { whiteKeyIndex: 3, offset: 65 }, // F#
  { whiteKeyIndex: 4, offset: 65 }, // G#
  { whiteKeyIndex: 5, offset: 65 }, // A#
  { whiteKeyIndex: 7, offset: 65 }, // C#5
  { whiteKeyIndex: 8, offset: 65 }, // D#5
];

export function Piano() {
  const { whiteKeys, blackKeys, activeKeys, isLoaded, playNote, stopNote } = usePiano();

  const whiteKeyWidth = 60; // px
  const whiteKeyHeight = 200; // px
  const blackKeyWidth = 36; // px
  const blackKeyHeight = 120; // px

  return (
    <div className="piano-container">
      <div className="mb-6 text-center">
        <p className="text-sm text-muted-foreground">
          {isLoaded ? 'Click keys or use keyboard (A-L for white, W-E-T-Y-U-O-P for black)' : 'Loading...'}
        </p>
      </div>
      
      <div 
        className="relative mx-auto overflow-x-auto pb-4"
        style={{ 
          width: 'fit-content',
          maxWidth: '100%',
        }}
      >
        <div
          className="relative flex"
          style={{
            height: whiteKeyHeight,
            width: whiteKeys.length * whiteKeyWidth,
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
                marginRight: index < whiteKeys.length - 1 ? 2 : 0,
              }}
            />
          ))}
          
          {/* Black Keys */}
          {blackKeys.map((key, index) => {
            const position = BLACK_KEY_POSITIONS[index];
            const leftPosition = 
              position.whiteKeyIndex * (whiteKeyWidth + 2) + 
              (whiteKeyWidth - blackKeyWidth / 2) - 
              (blackKeyWidth / 2);
            
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
      
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground/60">
          Tip: Hold multiple keys for chords
        </p>
      </div>
    </div>
  );
}
