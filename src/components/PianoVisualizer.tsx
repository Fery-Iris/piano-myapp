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

    const NOTE_SPEED = 100; // Pixels per second
    // If canvas height is 200px, a note playing NOW is at Y=200.
    // A note playing in 1s is at Y=100.
    
    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (!currentSong || !isPlaying) return;

      const now = Tone.Transport.seconds;

      // Draw Notes
      currentSong.notes.forEach((note: any) => {
        // note.time might be "0:0:0" string or number
        let startTime = 0;
        let duration = 0;

        if (typeof note.time === 'number') {
           startTime = note.time;
        } else {
           startTime = Tone.Time(note.time).toSeconds();
        }
        
        if (typeof note.duration === 'number') {
            duration = note.duration;
        } else {
            duration = Tone.Time(note.duration).toSeconds();
        }

        const timeUntilHit = startTime - now;
        
        // Only draw if within visible range (e.g. 0 to 3 seconds in future)
        // And not too far in past
        if (timeUntilHit < 4 && timeUntilHit + duration > -1) {
            const yHit = height; 
            const yPos = yHit - (timeUntilHit * NOTE_SPEED);
            const barHeight = duration * NOTE_SPEED;

            const x = getNoteX(note.note);
            const isBlack = note.note.includes('#');
            
            // Draw
            ctx.fillStyle = isBlack ? '#a855f7' : '#06b6d4'; // Purple / Cyan
            ctx.globalAlpha = 0.8;

            
            const rectY = yPos - barHeight;
            const w = isBlack ? 20 : 36;
            
            // Rounded rect visual hack? Just rect for now.
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
      height={500} // Increased height for longer waterfall
      className="w-full h-full pointer-events-none"
      style={{
         zIndex: 0
      }}
    />
  );
}
