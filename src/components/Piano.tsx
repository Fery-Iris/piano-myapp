import { PianoKey } from './PianoKey';
import type { PianoKey as PianoKeyType } from '@/hooks/usePiano';
import { PianoVisualizer } from './PianoVisualizer';
import { Song } from '@/data/songs';

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
  currentSong: Song | null;
  isPlayingSong: boolean;
}

export function Piano({ whiteKeys, blackKeys, activeKeys, isLoaded, playNote, stopNote, currentSong, isPlayingSong }: PianoProps) {
  // Narrower keys for 3 octaves
  const whiteKeyWidth = 44; // px 
  const whiteKeyHeight = 180; // px
  const blackKeyWidth = 28; // px
  const blackKeyHeight = 110; // px
  const keyGap = 2; // px

  // Speaker pattern style
  const speakerStyle = {
    backgroundImage: "radial-gradient(#222 1.5px, transparent 1.5px)",
    backgroundSize: "6px 6px",
    backgroundColor: "#111",
    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.8)"
  };

  const Chassis = ({ children }: { children: React.ReactNode }) => (
    <div className="relative inline-block rounded-[2rem] bg-gradient-to-b from-[#1a1a1a] via-[#111] to-black p-6 shadow-2xl ring-1 ring-white/10">
      {/* Top Bezel / Brand Bar */}
      <div className="mb-4 flex h-16 w-full items-center justify-between rounded-xl bg-gradient-to-b from-[#222] to-[#111] px-6 shadow-inner ring-1 ring-white/5">
         <div className="flex h-2 w-2 gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-red-900/50"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-red-900/50"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-red-900/50"></div>
         </div>
         <div className="font-serif text-sm tracking-[0.3em] text-white/20">VIRTUAL GRAND</div>
         <div className="flex h-2 w-2 gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-red-900/50"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-red-900/50"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-red-900/50"></div>
         </div>
      </div>

      <div className="flex items-end gap-6">
        {/* Left Speaker */}
        <div className="hidden h-[180px] w-24 rounded-lg border border-white/5 lg:block" style={speakerStyle}></div>
        
        {/* Key Bed */}
        <div className="relative rounded-b-lg bg-[#0a0a0a] p-[4px] shadow-lg ring-1 ring-white/5">
          {/* Visualizer Area (Dark Void above keys) */}
          <div className={`hidden md:block absolute bottom-[176px] left-[4px] right-[4px] h-[800px] bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none overflow-hidden z-0 rounded-t-lg transition-opacity duration-500 ${isPlayingSong ? 'opacity-100' : 'opacity-0'}`}>
             <PianoVisualizer currentSong={currentSong} isPlaying={isPlayingSong} />
          </div>

          {/* Red Felt Strip */}
          <div className="absolute left-0 right-0 top-0 h-1 bg-red-900/80 blur-[1px] z-10"></div>
          
          <div className="relative z-20">
             {children}
          </div>
        </div>

        {/* Right Speaker */}
        <div className="hidden h-[180px] w-24 rounded-lg border border-white/5 lg:block" style={speakerStyle}></div>
      </div>

       {/* Bottom Reflection/Base */}
       <div className="mt-4 h-2 w-full rounded-full bg-black/40 blur-md"></div>
    </div>
  );

  return (
    <div className="piano-container flex justify-center py-8 w-full overflow-x-auto md:overflow-visible px-4 md:px-0 scrollbar-hide">
      <div className="min-w-fit">
      <Chassis>
        <div className="mx-auto"> {/* Removed piano-scroll-container constraints to fit chassis */}
          {/* Loading / Instructions Helper Text - Now strictly above keys if needed, or minimal */}
          {!isLoaded && <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 text-white">Loading Sounds...</div>}
          
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
      </Chassis>
      </div>
    </div>
  );
}
