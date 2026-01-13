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

// Salamander Grand Piano samples from Tone.js CDN
const SAMPLE_BASE_URL = 'https://tonejs.github.io/audio/salamander/';

export function usePiano() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(-12); // Default to -12dB
  const samplerRef = useRef<Tone.Sampler | null>(null);
  const limiterRef = useRef<Tone.Limiter | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const audioStartedRef = useRef(false);

  useEffect(() => {
    // Set master volume
    Tone.getDestination().volume.value = volume;

    // Create a limiter to prevent distortion
    limiterRef.current = new Tone.Limiter(-1).toDestination();

    // Add reverb for room ambiance
    reverbRef.current = new Tone.Reverb({
      decay: 1.5,
      wet: 0.3,
    });
    reverbRef.current.connect(limiterRef.current);

    // Create Sampler with Salamander Grand Piano samples
    samplerRef.current = new Tone.Sampler({
      urls: {
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

  // Update volume in real-time
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
