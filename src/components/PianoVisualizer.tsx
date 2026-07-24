import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Song, SongNote } from '@/data/songs';

interface PianoVisualizerProps {
  currentSong: Song | null;
  isPlaying: boolean;
}

export function PianoVisualizer({ currentSong, isPlaying }: PianoVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Constants
    const keyWidth = 44; 
    const keyGap = 2;

    const getNoteX = (note: string): number => {
      const oct = parseInt(note.slice(-1));
      const pitch = note.slice(0, -1);
      
      // Calculate white key index
      let whiteIndex = (oct - 3) * 7;
      const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      const pitchIndex = whiteNotes.indexOf(pitch.replace('#', '')); // Rough approx
      
      if (pitchIndex !== -1) whiteIndex += pitchIndex;
      
      // Base X for white key
      let x = whiteIndex * (keyWidth + keyGap);

      // Adjust for black keys
      if (note.includes('#')) {
         x += (keyWidth * 0.6); // Offset
      }
      
      // Center the note width
      return x;
    };

    const NOTE_SPEED = 100; 
    
    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (!currentSong || !isPlaying) return;

      const nowSeconds = Tone.Transport.seconds;
      const currentTick = Tone.Transport.ticks; // Get current tick position
      const ppq = Tone.Transport.PPQ;
      
      // Calculate Pixels Per Tick
      // Desire: 1 Beat (quarter note) = 100 pixels height?
      // 1 Beat = PPQ ticks (usually 192).
      // PIXELS_PER_TICK = 100 / 192 ~= 0.52
      const PIXELS_PER_TICK = 120 / ppq; // slightly faster feel -> 120px per beat

      // Draw Notes
      currentSong.notes.forEach((note: any) => {
        // We MUST use ticks for stable visual speed relative to audio speed
        let startTick = 0;
        let durationTicks = 0;

        if (note.ticks !== undefined) {
           startTick = note.ticks;
        } else if (typeof note.time === 'number') {
           // Fallback for seconds-based notes without ticks (shouldn't happen with our recent fix, but safety first)
           // Convert seconds to ticks using current BPM. 
           // Note: This might jitter if BPM changes, but manual songs have ticks injected now.
           startTick = note.time * (Tone.Transport.bpm.value / 60) * ppq;
        } else {
           startTick = Tone.Time(note.time).toTicks();
        }
        
        if (note.rawDurationTicks !== undefined) {
             durationTicks = note.rawDurationTicks;
        } else if (note.durationTicks !== undefined) {
             // Tone.js MIDI parser gives durationTicks as number, or it might be string "192i"
             durationTicks = typeof note.durationTicks === 'string' ? parseInt(note.durationTicks) : note.durationTicks;
        } else if (typeof note.duration === 'number') {
             durationTicks = note.duration * (Tone.Transport.bpm.value / 60) * ppq;
        } else {
             durationTicks = Tone.Time(note.duration).toTicks();
        }

        const ticksUntilHit = startTick - currentTick;
        
        // Visible range in Ticks
        // Height 800px.
        // Max Ticks = 800 / PIXELS_PER_TICK = 800 / 0.6 = ~1333 ticks (~7 beats).
        // Let's render if within range.
        const maxVisibleTicks = height / PIXELS_PER_TICK;

        if (ticksUntilHit < maxVisibleTicks && ticksUntilHit + durationTicks > -100) {
            const yHit = height; 
            const yPos = yHit - (ticksUntilHit * PIXELS_PER_TICK);
            const barHeight = durationTicks * PIXELS_PER_TICK;

            const x = getNoteX(note.note);
            const isBlack = note.note.includes('#');
            
            // Draw
            ctx.fillStyle = isBlack ? '#a855f7' : '#06b6d4'; // Purple / Cyan
            ctx.globalAlpha = 0.8;
            
            const rectY = yPos - barHeight;
            const w = isBlack ? 20 : 36;
            
            ctx.fillRect(x + (keyGap), rectY, w, barHeight);
            
            // Glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = ctx.fillStyle;
        }
      });
      
      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentSong, isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      width={960} // Approx 21 white keys * 46px
      height={800} // Increased height for longer waterfall
      className="w-full h-full pointer-events-none"
      style={{
         zIndex: 0
      }}
    />
  );
}
