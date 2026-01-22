import { useState, useEffect, useCallback, useRef } from "react";
import * as Tone from "tone";
import { Midi } from "@tonejs/midi";
import { SONGS, Song } from "@/data/songs";
export interface PianoKey {
  note: string;
  keyLabel: string;
  isBlack: boolean;
}

// 3 octaves: C3 to B5 (21 white keys)
const WHITE_KEYS: PianoKey[] = [
  // Octave 3 (Z row)
  { note: "C3", keyLabel: "Z", isBlack: false },
  { note: "D3", keyLabel: "X", isBlack: false },
  { note: "E3", keyLabel: "C", isBlack: false },
  { note: "F3", keyLabel: "V", isBlack: false },
  { note: "G3", keyLabel: "B", isBlack: false },
  { note: "A3", keyLabel: "N", isBlack: false },
  { note: "B3", keyLabel: "M", isBlack: false },
  // Octave 4 (A row)
  { note: "C4", keyLabel: "A", isBlack: false },
  { note: "D4", keyLabel: "S", isBlack: false },
  { note: "E4", keyLabel: "D", isBlack: false },
  { note: "F4", keyLabel: "F", isBlack: false },
  { note: "G4", keyLabel: "G", isBlack: false },
  { note: "A4", keyLabel: "H", isBlack: false },
  { note: "B4", keyLabel: "J", isBlack: false },
  // Octave 5 (Q row)
  { note: "C5", keyLabel: "Q", isBlack: false },
  { note: "D5", keyLabel: "W", isBlack: false },
  { note: "E5", keyLabel: "E", isBlack: false },
  { note: "F5", keyLabel: "R", isBlack: false },
  { note: "G5", keyLabel: "T", isBlack: false },
  { note: "A5", keyLabel: "Y", isBlack: false },
  { note: "B5", keyLabel: "U", isBlack: false },
];

// 15 black keys across 3 octaves
const BLACK_KEYS: PianoKey[] = [
  // Octave 3 (number row 1-5)
  { note: "C#3", keyLabel: "1", isBlack: true },
  { note: "D#3", keyLabel: "2", isBlack: true },
  { note: "F#3", keyLabel: "3", isBlack: true },
  { note: "G#3", keyLabel: "4", isBlack: true },
  { note: "A#3", keyLabel: "5", isBlack: true },
  // Octave 4 (number row 6-0)
  { note: "C#4", keyLabel: "6", isBlack: true },
  { note: "D#4", keyLabel: "7", isBlack: true },
  { note: "F#4", keyLabel: "8", isBlack: true },
  { note: "G#4", keyLabel: "9", isBlack: true },
  { note: "A#4", keyLabel: "0", isBlack: true },
  // Octave 5 (I O P [ ])
  { note: "C#5", keyLabel: "I", isBlack: true },
  { note: "D#5", keyLabel: "O", isBlack: true },
  { note: "F#5", keyLabel: "P", isBlack: true },
  { note: "G#5", keyLabel: "[", isBlack: true },
  { note: "A#5", keyLabel: "]", isBlack: true },
];

const KEY_TO_NOTE: Record<string, string> = {
  // White keys - Octave 3 (Z row)
  z: "C3",
  x: "D3",
  c: "E3",
  v: "F3",
  b: "G3",
  n: "A3",
  m: "B3",
  // White keys - Octave 4 (A row)
  a: "C4",
  s: "D4",
  d: "E4",
  f: "F4",
  g: "G4",
  h: "A4",
  j: "B4",
  // White keys - Octave 5 (Q row)
  q: "C5",
  w: "D5",
  e: "E5",
  r: "F5",
  t: "G5",
  y: "A5",
  u: "B5",
  // Black keys - Octave 3 (number row)
  "1": "C#3",
  "2": "D#3",
  "3": "F#3",
  "4": "G#3",
  "5": "A#3",
  // Black keys - Octave 4 (number row)
  "6": "C#4",
  "7": "D#4",
  "8": "F#4",
  "9": "G#4",
  "0": "A#4",
  // Black keys - Octave 5
  i: "C#5",
  o: "D#5",
  p: "F#5",
  "[": "G#5",
  "]": "A#5",
};

// Salamander Grand Piano samples from Tone.js CDN
const SAMPLE_BASE_URL = "https://tonejs.github.io/audio/salamander/";

export function usePiano() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(-5);
  const [isSustainActive, setIsSustainActive] = useState(false);
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<any[]>([]);
  
  // Learn Mode State
  const [isLearnMode, setIsLearnMode] = useState(false);
  const [waitingForNotes, setWaitingForNotes] = useState<Set<string>>(new Set());
  const nextNoteIndexRef = useRef(0);
  const isWaitingRef = useRef(false);

  // Reset learn state on song change
  useEffect(() => {
    nextNoteIndexRef.current = 0;
    setWaitingForNotes(new Set());
    isWaitingRef.current = false;
  }, [currentSong]);
  
  const samplerRef = useRef<Tone.Sampler | null>(null);
  const limiterRef = useRef<Tone.Limiter | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const audioStartedRef = useRef(false);
  const sustainedNotesRef = useRef<Set<string>>(new Set());
  const activePartRef = useRef<Tone.Part | null>(null);
  
  // Recording Refs
  const recordingStartTimeRef = useRef<number>(0);
  const currentRecordingRef = useRef<any[]>([]);
  const activeRecordingNotesRef = useRef<Map<string, number>>(new Map()); // Note -> StartTime

  // Learn Mode Watcher Loop
  useEffect(() => {
    if (!isLearnMode || !isPlayingSong || !currentSong) return;

    const interval = setInterval(() => {
      // If already waiting, don't double check
      if (isWaitingRef.current) return;

      const now = Tone.Transport.seconds;
      const notes = currentSong.notes;
      
      if (nextNoteIndexRef.current >= notes.length) return;

      const nextNote = notes[nextNoteIndexRef.current];
      // Skip past notes
      let nextTime = 0;
      if (typeof nextNote.time === 'number') {
         nextTime = nextNote.time;
      } else {
         nextTime = Tone.Time(nextNote.time).toSeconds();
      }

      // Check if we reached the note (with 0.05s lookahead buffer)
      if (now >= nextTime - 0.05) {
         // Identify ALL notes at this approximate timestamp (chord handling)
         const chordNotes = new Set<string>();
         let i = nextNoteIndexRef.current;
         while(i < notes.length) {
            const n = notes[i];
            let t = typeof n.time === 'number' ? n.time : Tone.Time(n.time).toSeconds();
            if (Math.abs(t - nextTime) < 0.1) { // 0.1s tolerance for chords
               chordNotes.add(n.note);
               i++;
            } else {
               break;
            }
         }
         
         // PAUSE
         Tone.Transport.pause();
         setWaitingForNotes(chordNotes);
         isWaitingRef.current = true;
         // Store the index where we should resume searching from, but don't skip yet
         // Actually, we advance the ref so we don't trigger this again for the same chord
         nextNoteIndexRef.current = i; 
      }
    }, 20); // Check 50 times a second

    return () => clearInterval(interval);
  }, [isLearnMode, isPlayingSong, currentSong]);

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
        C3: "C3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
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
      activePartRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    Tone.getDestination().volume.value = volume;
  }, [volume]);

  // Sustain Pedal Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsSustainActive(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsSustainActive(false);
        // Release all sustained notes
        if (samplerRef.current) {
          sustainedNotesRef.current.forEach((note) => {
            samplerRef.current?.triggerRelease(note, Tone.now());
          });
          sustainedNotesRef.current.clear();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const startAudio = useCallback(async () => {
    if (!audioStartedRef.current) {
      await Tone.start();
      audioStartedRef.current = true;
    }
  }, []);

  const startRecording = useCallback(async () => {
    await startAudio();
    setIsRecording(true);
    recordingStartTimeRef.current = Tone.now();
    currentRecordingRef.current = [];
    activeRecordingNotesRef.current.clear();
    setRecordedNotes([]);
  }, [startAudio]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    const now = Tone.now();
    activeRecordingNotesRef.current.forEach((startTime, note) => {
       const duration = now - startTime;
       currentRecordingRef.current.push({
         note,
         time: startTime - recordingStartTimeRef.current,
         duration,
         velocity: 1 
       });
    });
    activeRecordingNotesRef.current.clear();
    currentRecordingRef.current.sort((a,b) => a.time - b.time);
    setRecordedNotes(currentRecordingRef.current);
  }, []);



  const playNote = useCallback(
    async (note: string) => {
      await startAudio();
      
      // Learn Mode Interception
      if (isLearnMode && isWaitingRef.current) {
          console.log(`[Study] Note played: ${note}`);
          console.log(`[Study] Waiting for:`, Array.from(waitingForNotes));
          
          if (waitingForNotes.has(note)) {
              console.log(`[Study] MATCH! Removing ${note}`);
              setWaitingForNotes(prev => {
                 const next = new Set(prev);
                 next.delete(note);
                 return next;
              });
              
              if (waitingForNotes.size <= 1 && waitingForNotes.has(note)) {
                  console.log(`[Study] All notes pressed. RESUMING SONG.`);
                  Tone.Transport.start();
                  isWaitingRef.current = false;
                  setWaitingForNotes(new Set());
              }
          } else {
             console.log(`[Study] No match.`);
          }
      }

      if (isRecording) {
        activeRecordingNotesRef.current.set(note, Tone.now());
      }

      if (samplerRef.current && isLoaded && !activeKeys.has(note)) {
         // If note is already playing (rapid retrigger), release it first? 
        // Tone.Sampler handles this well usually, just triggerAttack.
        samplerRef.current.triggerAttack(note, Tone.now());
        setActiveKeys((prev) => new Set([...prev, note]));
      }
    },
    [activeKeys, startAudio, isLoaded, isRecording]
  );

  const stopNote = useCallback(
    (note: string) => {
      // Recording Logic
      if (isRecording) {
         const startTime = activeRecordingNotesRef.current.get(note);
         if (startTime !== undefined) {
           const now = Tone.now();
           const duration = now - startTime;
           currentRecordingRef.current.push({
             note,
             time: startTime - recordingStartTimeRef.current,
             duration,
             velocity: 1
           });
           activeRecordingNotesRef.current.delete(note);
         }
      }

      // Always remove from visual active keys immediately
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });

      if (samplerRef.current) {
        if (isSustainActive) {
          sustainedNotesRef.current.add(note);
        } else {
          samplerRef.current.triggerRelease(note, Tone.now());
        }
      }
    },
    [isSustainActive, isRecording]
  );

  // Auto-Play Logic
  const stopSong = useCallback(() => {
    if (activePartRef.current) {
      activePartRef.current.stop();
      activePartRef.current.dispose();
      activePartRef.current = null;
    }
    Tone.Transport.stop();
    // Clear all visuals
    setActiveKeys(new Set());
    setIsPlayingSong(false);
    setCurrentSong(null);
    // Release all notes to be safe
    if (samplerRef.current) {
      samplerRef.current.releaseAll();
    }
  }, []);

  const playSong = useCallback(
    async (song: Song) => {
      await startAudio();
      stopSong(); // Stop any currently playing song

      setCurrentSong(song);
      setIsPlayingSong(true);
      Tone.Transport.bpm.value = song.bpm;

      // Create a Part to schedule notes
      const part = new Tone.Part((time, value) => {
        if (samplerRef.current) {
          // Play sound
          samplerRef.current.triggerAttackRelease(value.note, value.duration, time);
          
          // Visual: key down
          Tone.Draw.schedule(() => {
            setActiveKeys((prev) => new Set([...prev, value.note]));
          }, time);

          // Visual: key up after duration
          const durationSeconds = Tone.Time(value.duration).toSeconds();
          Tone.Draw.schedule(() => {
            setActiveKeys((prev) => {
              const next = new Set(prev);
              next.delete(value.note);
              return next;
            });
          }, time + durationSeconds);
        }
      }, song.notes).start(0);

      activePartRef.current = part;
      Tone.Transport.start();
    },
    [startAudio, stopSong]
  );

  const playRecording = useCallback(() => {
    if (recordedNotes.length === 0) return;
    
    const recSong: Song = {
      id: 'recording',
      name: 'Recording',
      bpm: 120, 
      notes: recordedNotes
    };
    
    playSong(recSong);
  }, [recordedNotes, playSong]);

  // Helper: Normalize Note Name (Db -> C#) to match our piano keys
  const getPianoNote = (midiNoteName: string, octaveShift: number): string | null => {
    // tonejs/midi usually returns specific format, but let's be robust
    // Regex to split Note+Accidental and Octave
    // e.g. "F#4", "Db3", "C-1"
    const match = midiNoteName.match(/^([A-G][#b]?)(-?\d+)$/);
    if (!match) return null;

    let [_, pitch, octaveStr] = match;
    let octave = parseInt(octaveStr) + octaveShift;

    // Convert Flats to Sharps
    const flatToSharp: Record<string, string> = {
      "Cb": "B", // B(octave-1) - complex, handle simply for now
      "Db": "C#",
      "Eb": "D#",
      "Fb": "E",
      "Gb": "F#",
      "Ab": "G#",
      "Bb": "A#",
    };

    if (pitch.endsWith("b")) {
      if (pitch === "Cb") octave -= 1; // Cb4 is B3
      pitch = flatToSharp[pitch] || pitch;
    }

    // Clamp octave to ensure it's audible/visible (mostly)
    // Our range is roughly 3-5. 
    // Let's just return the calculated note.
    return `${pitch}${octave}`;
  };

  // MIDI File Playback with Smart Transpose
  const playMidiFile = useCallback(async (fileData: ArrayBuffer, fileName: string) => {
    try {
      await startAudio();
      
      Tone.Transport.stop();
      Tone.Transport.cancel();
      if (activePartRef.current) {
        activePartRef.current.dispose();
        activePartRef.current = null;
      }
      setActiveKeys(new Set());

      const midi = new Midi(fileData);
      
      if (midi.tracks.every(t => t.notes.length === 0)) {
        console.error("No notes found in MIDI");
        return;
      }

      // 1. Calculate Shift
      // We want the melody to sit nicely in Octave 4.
      // Let's find the median pitch roughly.
      let totalPitchVal = 0;
      let noteCount = 0;
      midi.tracks.forEach(track => {
        track.notes.forEach(note => {
          totalPitchVal += note.midi; // MIDI number (60 = C4)
          noteCount++;
        });
      });
      
      const avgMidi = noteCount > 0 ? totalPitchVal / noteCount : 60;
      const targetMidiCenter = 66; // F#4 ~ Center of C3(48) - B5(83) range is approx 65.5
      const shiftSemitones = Math.round(targetMidiCenter - avgMidi);
      const shiftOctaves = Math.round(shiftSemitones / 12);
      
      console.log(`MIDI: Avg ${avgMidi}, Shift Octaves: ${shiftOctaves}`);

      // 2. Process Notes
      const midiNotes: any[] = [];
      midi.tracks.forEach(track => {
        track.notes.forEach(note => {
          try {
             const finalNote = getPianoNote(note.name, shiftOctaves);
             if (finalNote) {
                midiNotes.push({
                  time: note.time,
                  note: finalNote,
                  duration: note.duration,
                  velocity: note.velocity
                });
             }
          } catch (e) {
             // skip
          }
        });
      });

      setCurrentSong({ id: "midi", name: fileName, bpm: midi.header.tempos[0]?.bpm || 120, notes: midiNotes });
      setIsPlayingSong(true);

      if (midi.header.tempos.length > 0) {
        Tone.Transport.bpm.value = midi.header.tempos[0].bpm;
      }

      const part = new Tone.Part((time, value) => {
        if (samplerRef.current) {
           samplerRef.current.triggerAttackRelease(value.note, value.duration, time, value.velocity);

           Tone.Draw.schedule(() => {
             setActiveKeys((prev) => new Set([...prev, value.note]));
           }, time);

           Tone.Draw.schedule(() => {
             setActiveKeys((prev) => {
               const next = new Set(prev);
               next.delete(value.note);
               return next;
             });
           }, time + value.duration);
        }
      }, midiNotes).start(0);

      activePartRef.current = part;
      await Tone.Transport.start();

    } catch (e) {
      console.error("Error parsing MIDI:", e);
      setIsPlayingSong(false);
    }
  }, [startAudio]);

  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
  }, []);

  // Keyboard play Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow jamming during playback!
      if (e.repeat) return;
      const note = KEY_TO_NOTE[e.key.toLowerCase()];
      if (note) {
        playNote(note);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
       // Disable stopNote if triggered by song? No, songs use their own scheduling.
      const note = KEY_TO_NOTE[e.key.toLowerCase()];
      if (note) {
        stopNote(note);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [playNote, stopNote, isPlayingSong]);

  return {
    whiteKeys: WHITE_KEYS,
    blackKeys: BLACK_KEYS,
    activeKeys,
    isLoaded,
    volume,
    isSustainActive,
    isPlayingSong,
    currentSong,
    updateVolume,
    playNote,
    stopNote,
    playSong,
    stopSong,
    playMidiFile,
    isRecording,
    startRecording,
    stopRecording,
    playRecording,
    recordedNotes,
    songs: SONGS,
    isLearnMode,
    setIsLearnMode,
    waitingForNotes,
  };
}
