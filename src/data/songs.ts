export interface SongNote {
  time: string; // m:q:s (bars:quarters:sixteenths)
  note: string;
  duration: string;
}

export interface Song {
  id: string;
  name: string;
  bpm: number;
  notes: SongNote[];
}

export const SONGS: Song[] = [
  {
    id: "river-flows",
    name: "Melody 1",
    bpm: 65,
    notes: [
      // --- River Flows in You (F# Minor / A Major) ---
      // Key Signature: F#, C#, G#

      // Bar 1 (F#m)
      { time: "0:0:0", note: "F#3", duration: "2n" }, // Bass
      { time: "0:0:0", note: "C#5", duration: "8n" },
      { time: "0:0:2", note: "D5", duration: "16n" },
      { time: "0:0:3", note: "C#5", duration: "16n" }, // Grace-ish
      { time: "0:1:0", note: "A4", duration: "8n" },
      { time: "0:1:2", note: "G#4", duration: "8n" },
      { time: "0:2:0", note: "A4", duration: "8n" },
      { time: "0:2:2", note: "E5", duration: "8n" },
      { time: "0:3:0", note: "A4", duration: "8n" },
      { time: "0:3:2", note: "D5", duration: "8n" },

      // Bar 2 (D Major)
      { time: "1:0:0", note: "D3", duration: "2n" }, // Bass
      { time: "1:0:0", note: "A4", duration: "8n" }, 
      { time: "1:0:2", note: "G#4", duration: "16n" },
      { time: "1:0:3", note: "A4", duration: "16n" },
      { time: "1:1:0", note: "E5", duration: "8n" },
      { time: "1:1:2", note: "A4", duration: "8n" },
      { time: "1:2:0", note: "E5", duration: "8n" },
      { time: "1:2:2", note: "F#5", duration: "8n" },
      { time: "1:3:0", note: "E5", duration: "8n" },
      { time: "1:3:2", note: "C#5", duration: "8n" },

      // Bar 3 (A Major)
      { time: "2:0:0", note: "A2", duration: "2n" }, // Bass
      { time: "2:0:0", note: "A4", duration: "4n" },
      { time: "2:1:0", note: "C#5", duration: "8n" },
      { time: "2:1:2", note: "E5", duration: "8n" },
      { time: "2:2:0", note: "A5", duration: "8n" },
      { time: "2:2:2", note: "G#5", duration: "8n" },
      { time: "2:3:0", note: "A5", duration: "8n" },
      { time: "2:3:2", note: "E5", duration: "8n" },
      
      // Bar 4 (E Major)
      { time: "3:0:0", note: "E3", duration: "2n" }, // Bass
      { time: "3:0:0", note: "G#4", duration: "4n" },
      { time: "3:1:0", note: "B4", duration: "4n" },
      { time: "3:2:0", note: "E5", duration: "8n" },
      { time: "3:2:2", note: "D5", duration: "8n" },
      { time: "3:3:0", note: "C#5", duration: "8n" },
      { time: "3:3:2", note: "B4", duration: "8n" },

      // Repeat / Variation
      { time: "4:0:0", note: "F#3", duration: "2n" }, // Bass
      { time: "4:0:0", note: "A4", duration: "8n" },
      { time: "4:0:2", note: "C#5", duration: "8n" },
      { time: "4:1:0", note: "E5", duration: "4n" },
      { time: "4:2:0", note: "D5", duration: "8n" },
      { time: "4:2:2", note: "C#5", duration: "8n" },
      { time: "4:3:0", note: "B4", duration: "8n" },
      { time: "4:3:2", note: "C#5", duration: "8n" },

      { time: "5:0:0", note: "D3", duration: "2n" }, // Bass
      { time: "5:0:0", note: "E5", duration: "2n" },
      { time: "5:2:0", note: "F#5", duration: "4n" },
      { time: "5:3:0", note: "E5", duration: "4n" },
    ]
  },
  {
    id: "canon-d",
    name: "Melody 2",
    bpm: 75,
    notes: [
      // Key: D Major (F#, C#)
      // Chords: D - A - Bm - F#m - G - D - G - A
      
      // --- Cycle 1: Quarter Notes Melody ---
      { time: "0:0:0", note: "F#5", duration: "4n" }, { time: "0:0:0", note: "D3", duration: "2n" },
      { time: "0:1:0", note: "E5", duration: "4n" },
      { time: "0:2:0", note: "D5", duration: "4n" }, { time: "0:2:0", note: "A2", duration: "2n" },
      { time: "0:3:0", note: "C#5", duration: "4n" },

      { time: "1:0:0", note: "B4", duration: "4n" }, { time: "1:0:0", note: "B2", duration: "2n" },
      { time: "1:1:0", note: "A4", duration: "4n" },
      { time: "1:2:0", note: "B4", duration: "4n" }, { time: "1:2:0", note: "F#2", duration: "2n" },
      { time: "1:3:0", note: "C#5", duration: "4n" },

      { time: "2:0:0", note: "D5", duration: "4n" }, { time: "2:0:0", note: "G2", duration: "2n" },
      { time: "2:1:0", note: "C#5", duration: "4n" },
      { time: "2:2:0", note: "B4", duration: "4n" }, { time: "2:2:0", note: "D2", duration: "2n" },
      { time: "2:3:0", note: "A4", duration: "4n" },

      { time: "3:0:0", note: "G4", duration: "4n" }, { time: "3:0:0", note: "G2", duration: "2n" },
      { time: "3:1:0", note: "F#4", duration: "4n" },
      { time: "3:2:0", note: "E4", duration: "4n" }, { time: "3:2:0", note: "A2", duration: "2n" },
      { time: "3:3:0", note: "G4", duration: "4n" }, // Leading to A

      // --- Cycle 2: Eighth Notes (Famous Part) ---
      { time: "4:0:0", note: "F#5", duration: "8n" }, { time: "4:0:0", note: "D3", duration: "2n" },
      { time: "4:0:2", note: "A5", duration: "8n" },
      { time: "4:1:0", note: "G5", duration: "8n" },
      { time: "4:1:2", note: "F#5", duration: "8n" },
      
      { time: "4:2:0", note: "E5", duration: "8n" }, { time: "4:2:0", note: "A2", duration: "2n" },
      { time: "4:2:2", note: "D5", duration: "8n" },
      { time: "4:3:0", note: "C#5", duration: "8n" },
      { time: "4:3:2", note: "B4", duration: "8n" },

      { time: "5:0:0", note: "D5", duration: "8n" }, { time: "5:0:0", note: "B2", duration: "2n" },
      { time: "5:0:2", note: "F#5", duration: "8n" },
      { time: "5:1:0", note: "E5", duration: "8n" },
      { time: "5:1:2", note: "D5", duration: "8n" },
      
      { time: "5:2:0", note: "C#5", duration: "8n" }, { time: "5:2:0", note: "F#2", duration: "2n" },
      { time: "5:2:2", note: "B4", duration: "8n" },
      { time: "5:3:0", note: "A4", duration: "8n" },
      { time: "5:3:2", note: "G4", duration: "8n" },

      // ... G - D - G - A ...
      { time: "6:0:0", note: "B4", duration: "4n" }, { time: "6:0:0", note: "G2", duration: "2n" },
      { time: "6:1:0", note: "D5", duration: "4n" },
      
      { time: "6:2:0", note: "D4", duration: "4n" }, { time: "6:2:0", note: "D2", duration: "2n" },
      { time: "6:3:0", note: "F#4", duration: "4n" },

      { time: "7:0:0", note: "G4", duration: "4n" }, { time: "7:0:0", note: "G2", duration: "2n" },
      { time: "7:1:0", note: "B4", duration: "4n" },
      
      { time: "7:2:0", note: "A4", duration: "2n" }, { time: "7:2:0", note: "A2", duration: "2n" },
    ]
  },
  {
    id: "mario",
    name: "Super Mario Bros",
    bpm: 180,
    notes: [
      // Intro
      { time: "0:0:0", note: "E5", duration: "8n" },
      { time: "0:0:2", note: "E5", duration: "8n" },
      { time: "0:1:0", note: "E5", duration: "8n" },
      { time: "0:1:2", note: "C5", duration: "8n" },
      { time: "0:2:0", note: "E5", duration: "4n" },
      { time: "0:3:0", note: "G5", duration: "4n" },
      { time: "1:1:0", note: "G4", duration: "4n" },

      // Theme Main
      { time: "1:3:0", note: "C5", duration: "4n" },
      { time: "2:0:2", note: "G4", duration: "4n" },
      { time: "2:2:0", note: "E4", duration: "4n" },
      
      { time: "2:3:2", note: "A4", duration: "4n" },
      { time: "3:0:2", note: "B4", duration: "4n" },
      { time: "3:1:2", note: "A#4", duration: "8n" },
      { time: "3:2:0", note: "A4", duration: "4n" },

      { time: "3:3:0", note: "G4", duration: "8n" },
      { time: "3:3:2", note: "E5", duration: "8n" },
      { time: "4:0:0", note: "G5", duration: "8n" },
      { time: "4:0:2", note: "A5", duration: "4n" },
      { time: "4:1:2", note: "F5", duration: "8n" },
      { time: "4:2:0", note: "G5", duration: "8n" },
      
      { time: "4:3:0", note: "E5", duration: "4n" },
      { time: "5:0:0", note: "C5", duration: "8n" },
      { time: "5:0:2", note: "D5", duration: "8n" },
      { time: "5:1:0", note: "B4", duration: "4n" },

      // Repeat / Extension
      { time: "5:3:0", note: "C5", duration: "4n" },
      { time: "6:0:2", note: "G4", duration: "4n" },
      { time: "6:2:0", note: "E4", duration: "4n" },
      
      { time: "6:3:2", note: "A4", duration: "4n" },
      { time: "7:0:2", note: "B4", duration: "4n" },
      { time: "7:1:2", note: "A#4", duration: "8n" },
      { time: "7:2:0", note: "A4", duration: "4n" },

      { time: "7:3:0", note: "G4", duration: "8n" },
      { time: "7:3:2", note: "E5", duration: "8n" },
      { time: "8:0:0", note: "G5", duration: "8n" },
      { time: "8:0:2", note: "A5", duration: "4n" },
      { time: "8:1:2", note: "F5", duration: "8n" },
      { time: "8:2:0", note: "G5", duration: "8n" },
      
      { time: "8:3:0", note: "E5", duration: "4n" },
      { time: "9:0:0", note: "C5", duration: "8n" },
      { time: "9:0:2", note: "D5", duration: "8n" },
      { time: "9:1:0", note: "B4", duration: "4n" },
      { time: "9:3:0", note: "C5", duration: "1n" },
    ]
  }
];
