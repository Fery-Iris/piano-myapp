import { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';

export interface PianoKey {
  note: string;
  keyLabel: string;
  isBlack: boolean;
}

// 3 octaves: C3 to B5 (21 white keys)
const WHITE_KEYS: PianoKey[] = [
  // Octave 3 (Z row)
  { note: 'C3', keyLabel: 'Z', isBlack: false },
  { note: 'D3', keyLabel: 'X', isBlack: false },
  { note: 'E3', keyLabel: 'C', isBlack: false },
  { note: 'F3', keyLabel: 'V', isBlack: false },
  { note: 'G3', keyLabel: 'B', isBlack: false },
  { note: 'A3', keyLabel: 'N', isBlack: false },
  { note: 'B3', keyLabel: 'M', isBlack: false },
  // Octave 4 (A row)
  { note: 'C4', keyLabel: 'A', isBlack: false },
  { note: 'D4', keyLabel: 'S', isBlack: false },
  { note: 'E4', keyLabel: 'D', isBlack: false },
  { note: 'F4', keyLabel: 'F', isBlack: false },
  { note: 'G4', keyLabel: 'G', isBlack: false },
  { note: 'A4', keyLabel: 'H', isBlack: false },
  { note: 'B4', keyLabel: 'J', isBlack: false },
  // Octave 5 (Q row)
  { note: 'C5', keyLabel: 'Q', isBlack: false },
  { note: 'D5', keyLabel: 'W', isBlack: false },
  { note: 'E5', keyLabel: 'E', isBlack: false },
  { note: 'F5', keyLabel: 'R', isBlack: false },
  { note: 'G5', keyLabel: 'T', isBlack: false },
  { note: 'A5', keyLabel: 'Y', isBlack: false },
  { note: 'B5', keyLabel: 'U', isBlack: false },
];

// 15 black keys across 3 octaves
const BLACK_KEYS: PianoKey[] = [
  // Octave 3 (number row 1-5)
  { note: 'C#3', keyLabel: '1', isBlack: true },
  { note: 'D#3', keyLabel: '2', isBlack: true },
  { note: 'F#3', keyLabel: '3', isBlack: true },
  { note: 'G#3', keyLabel: '4', isBlack: true },
  { note: 'A#3', keyLabel: '5', isBlack: true },
  // Octave 4 (number row 6-0)
  { note: 'C#4', keyLabel: '6', isBlack: true },
  { note: 'D#4', keyLabel: '7', isBlack: true },
  { note: 'F#4', keyLabel: '8', isBlack: true },
  { note: 'G#4', keyLabel: '9', isBlack: true },
  { note: 'A#4', keyLabel: '0', isBlack: true },
  // Octave 5 (I O P [ ])
  { note: 'C#5', keyLabel: 'I', isBlack: true },
  { note: 'D#5', keyLabel: 'O', isBlack: true },
  { note: 'F#5', keyLabel: 'P', isBlack: true },
  { note: 'G#5', keyLabel: '[', isBlack: true },
  { note: 'A#5', keyLabel: ']', isBlack: true },
];

const KEY_TO_NOTE: Record<string, string> = {
  // White keys - Octave 3 (Z row)
  'z': 'C3', 'x': 'D3', 'c': 'E3', 'v': 'F3', 'b': 'G3', 'n': 'A3', 'm': 'B3',
  // White keys - Octave 4 (A row)
  'a': 'C4', 's': 'D4', 'd': 'E4', 'f': 'F4', 'g': 'G4', 'h': 'A4', 'j': 'B4',
  // White keys - Octave 5 (Q row)
  'q': 'C5', 'w': 'D5', 'e': 'E5', 'r': 'F5', 't': 'G5', 'y': 'A5', 'u': 'B5',
  // Black keys - Octave 3 (number row)
  '1': 'C#3', '2': 'D#3', '3': 'F#3', '4': 'G#3', '5': 'A#3',
  // Black keys - Octave 4 (number row)
  '6': 'C#4', '7': 'D#4', '8': 'F#4', '9': 'G#4', '0': 'A#4',
  // Black keys - Octave 5
  'i': 'C#5', 'o': 'D#5', 'p': 'F#5', '[': 'G#5', ']': 'A#5',
};

// Salamander Grand Piano samples from Tone.js CDN
const SAMPLE_BASE_URL = 'https://tonejs.github.io/audio/salamander/';

export function usePiano() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(-12);
  const samplerRef = useRef<Tone.Sampler | null>(null);
  const limiterRef = useRef<Tone.Limiter | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const audioStartedRef = useRef(false);

  useEffect(() => {
    Tone.getDestination().volume.value = volume;

    limiterRef.current = new Tone.Limiter(-1).toDestination();

    reverbRef.current = new Tone.Reverb({
      decay: 1.5,
      wet: 0.3,
    });
    reverbRef.current.connect(limiterRef.current);

    // Extended samples for 3 octaves
    samplerRef.current = new Tone.Sampler({
      urls: {
        'C3': 'C3.mp3',
        'D#3': 'Ds3.mp3',
        'F#3': 'Fs3.mp3',
        'A3': 'A3.mp3',
        'C4': 'C4.mp3',
        'D#4': 'Ds4.mp3',
        'F#4': 'Fs4.mp3',
        'A4': 'A4.mp3',
        'C5': 'C5.mp3',
        'D#5': 'Ds5.mp3',
        'F#5': 'Fs5.mp3',
        'A5': 'A5.mp3',
      },
      baseUrl: SAMPLE_BASE_URL,
      release: 1,
      onload: () => {
        setIsLoaded(true);
      },
    });
    
    samplerRef.current.connect(reverbRef.current);

    return () => {
      samplerRef.current?.dispose();
      reverbRef.current?.dispose();
      limiterRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    Tone.getDestination().volume.value = volume;
  }, [volume]);

  const startAudio = useCallback(async () => {
    if (!audioStartedRef.current) {
      await Tone.start();
      audioStartedRef.current = true;
    }
  }, []);

  const playNote = useCallback(async (note: string) => {
    await startAudio();
    if (samplerRef.current && isLoaded && !activeKeys.has(note)) {
      samplerRef.current.triggerAttack(note, Tone.now());
      setActiveKeys(prev => new Set([...prev, note]));
    }
  }, [activeKeys, startAudio, isLoaded]);

  const stopNote = useCallback((note: string) => {
    if (samplerRef.current && activeKeys.has(note)) {
      samplerRef.current.triggerRelease(note, Tone.now());
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });
    }
  }, [activeKeys]);

  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
  }, []);

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
    volume,
    updateVolume,
    playNote,
    stopNote,
  };
}
