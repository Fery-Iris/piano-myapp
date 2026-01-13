import { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';

export interface PianoKey {
  note: string;
  keyLabel: string;
  isBlack: boolean;
}

const WHITE_KEYS: PianoKey[] = [
  { note: 'C4', keyLabel: 'A', isBlack: false },
  { note: 'D4', keyLabel: 'S', isBlack: false },
  { note: 'E4', keyLabel: 'D', isBlack: false },
  { note: 'F4', keyLabel: 'F', isBlack: false },
  { note: 'G4', keyLabel: 'G', isBlack: false },
  { note: 'A4', keyLabel: 'H', isBlack: false },
  { note: 'B4', keyLabel: 'J', isBlack: false },
  { note: 'C5', keyLabel: 'K', isBlack: false },
  { note: 'D5', keyLabel: 'L', isBlack: false },
  { note: 'E5', keyLabel: ';', isBlack: false },
];

const BLACK_KEYS: PianoKey[] = [
  { note: 'C#4', keyLabel: 'W', isBlack: true },
  { note: 'D#4', keyLabel: 'E', isBlack: true },
  { note: 'F#4', keyLabel: 'T', isBlack: true },
  { note: 'G#4', keyLabel: 'Y', isBlack: true },
  { note: 'A#4', keyLabel: 'U', isBlack: true },
  { note: 'C#5', keyLabel: 'O', isBlack: true },
  { note: 'D#5', keyLabel: 'P', isBlack: true },
];

const KEY_TO_NOTE: Record<string, string> = {
  'a': 'C4', 's': 'D4', 'd': 'E4', 'f': 'F4', 'g': 'G4', 'h': 'A4', 'j': 'B4', 'k': 'C5', 'l': 'D5', ';': 'E5',
  'w': 'C#4', 'e': 'D#4', 't': 'F#4', 'y': 'G#4', 'u': 'A#4', 'o': 'C#5', 'p': 'D#5',
};

export function usePiano() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const audioStartedRef = useRef(false);

  useEffect(() => {
    // Create a PolySynth with a realistic piano-like sound
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'triangle8',
      },
      envelope: {
        attack: 0.005,
        decay: 0.3,
        sustain: 0.2,
        release: 1.5,
      },
    }).toDestination();

    // Add some reverb for realism
    const reverb = new Tone.Reverb({
      decay: 2,
      wet: 0.3,
    }).toDestination();
    
    synthRef.current.connect(reverb);
    setIsLoaded(true);

    return () => {
      synthRef.current?.dispose();
      reverb.dispose();
    };
  }, []);

  const startAudio = useCallback(async () => {
    if (!audioStartedRef.current) {
      await Tone.start();
      audioStartedRef.current = true;
    }
  }, []);

  const playNote = useCallback(async (note: string) => {
    await startAudio();
    if (synthRef.current && !activeKeys.has(note)) {
      synthRef.current.triggerAttack(note, Tone.now());
      setActiveKeys(prev => new Set([...prev, note]));
    }
  }, [activeKeys, startAudio]);

  const stopNote = useCallback((note: string) => {
    if (synthRef.current && activeKeys.has(note)) {
      synthRef.current.triggerRelease(note, Tone.now());
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });
    }
  }, [activeKeys]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = KEY_TO_NOTE[e.key.toLowerCase()];
      if (note) {
        playNote(note);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = KEY_TO_NOTE[e.key.toLowerCase()];
      if (note) {
        stopNote(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playNote, stopNote]);

  return {
    whiteKeys: WHITE_KEYS,
    blackKeys: BLACK_KEYS,
    activeKeys,
    isLoaded,
    playNote,
    stopNote,
  };
}
