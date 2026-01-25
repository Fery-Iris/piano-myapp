import { Sun, Moon, Play, Square, Music, Upload, GraduationCap, Gauge } from 'lucide-react';
import { VolumeControl } from './VolumeControl';
import { Song, SONGS } from '@/data/songs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import React, { useRef, ChangeEvent, useEffect, useState } from 'react';
import { toast } from "sonner"

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  onPlaySong: (song: Song) => void;
  onStopSong: () => void;
  isPlayingSong: boolean;
  currentSong: Song | null;
  onPlayMidi: (data: ArrayBuffer, name: string) => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayRecording: () => void;
  hasRecording: boolean;
  isLearnMode: boolean;
  onSetLearnMode: (mode: boolean) => void;
  playbackSpeed?: number;
  onPlaybackSpeedChange?: (speed: number) => void;
}

export function Header({ 
  isDark, 
  onToggleTheme, 
  volume, 
  onVolumeChange,
  onPlaySong,
  onStopSong,
  isPlayingSong,
  currentSong,
  onPlayMidi,
  isRecording,
  onStartRecording,
  onStopRecording,
  onPlayRecording,
  hasRecording,
  isLearnMode,
  onSetLearnMode,
  playbackSpeed = 1,
  onPlaybackSpeedChange
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mode Selection Dialog State
  const [showModeDialog, setShowModeDialog] = useState(false);
  const [pendingSong, setPendingSong] = useState<Song | null>(null);
  const [pendingMidi, setPendingMidi] = useState<{data: ArrayBuffer, name: string} | null>(null);
  
  // Timer for recording
  const [timer, setTimer] = React.useState(0);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      setTimer(0);
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleSongSelect = (songId: string) => {
    const song = SONGS.find(s => s.id === songId);
    if (song) {
      setPendingSong(song);
      setPendingMidi(null);
      setShowModeDialog(true);
    }
  };

  const handleMidiUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result instanceof ArrayBuffer) {
          setPendingMidi({ data: e.target.result, name: file.name });
          setPendingSong(null);
          setShowModeDialog(true);
        }
      };
      reader.readAsArrayBuffer(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
       fileInputRef.current.value = "";
    }
  };

  const handleModeConfirm = (mode: 'listen' | 'study') => {
    onSetLearnMode(mode === 'study');
    
    // Slight delay to ensure mode state updates before playing? 
    // Usually React batching handles this, but let's just call play.
    
    if (pendingSong) {
       onPlaySong(pendingSong);
       toast.success(`Playing: ${pendingSong.name} (${mode === 'study' ? 'Study' : 'Listen'} Mode)`);
    } else if (pendingMidi) {
       onPlayMidi(pendingMidi.data, pendingMidi.name);
       toast.success(`Playing MIDI: ${pendingMidi.name} (${mode === 'study' ? 'Study' : 'Listen'} Mode)`);
    }
    
    setShowModeDialog(false);
    setPendingSong(null);
    setPendingMidi(null);
  };

  const triggerFileUpload = () => {
    if (!isPlayingSong) {
      fileInputRef.current?.click();
    }
  };
  


  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col md:flex-row items-center justify-between px-6 py-4 md:px-12 gap-4 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Piano
        </h1>
        <span className="text-sm font-light text-muted-foreground tracking-widest uppercase">
          Virtual
        </span>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Recording Controls */}
        <div className="flex items-center gap-1">
           {isRecording ? (
             <Button 
               variant="destructive" 
               size="sm" 
               className="h-8 px-3 animate-pulse" 
               onClick={onStopRecording}
             >
               <Square className="h-3 w-3 mr-2 fill-current" /> 
               {formatTime(timer)}
             </Button>
           ) : (
             <Button 
               variant="ghost" 
               size="sm" 
               className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-full" 
               onClick={onStartRecording}
               disabled={isPlayingSong}
               title="Record"
             >
               <div className="h-3 w-3 rounded-full bg-current" />
             </Button>
           )}
        </div>
        
        <div className="h-4 w-px bg-border hidden md:block" />

        {/* Song Library Control */}
        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border border-border/50">
          <Select 
            onValueChange={handleSongSelect} 
            value={currentSong?.id && currentSong.id !== 'midi' && currentSong.id !== 'recording' ? currentSong.id : ""} 
            disabled={isPlayingSong}
          >
            <SelectTrigger className="w-[160px] h-8 text-xs bg-transparent border-none shadow-none focus:ring-0">
              <div className="flex items-center gap-2">
                <Music className="h-3 w-3" />
                <SelectValue placeholder={currentSong?.id === 'midi' ? currentSong.name : (currentSong?.id === 'recording' ? 'User Recording' : "Select Song")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              {SONGS.map(song => (
                <SelectItem key={song.id} value={song.id} className="text-xs">
                  {song.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="w-px h-4 bg-border mx-1" />

          <input 
            type="file" 
            accept=".mid,.midi" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleMidiUpload} 
          />
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={triggerFileUpload}
            disabled={isPlayingSong && currentSong?.id !== 'midi'}
            title="Upload MIDI File"
          >
            <Upload className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Upload MIDI</span>
          </Button>

          {hasRecording && !isRecording && (
             <Button
               variant="outline"
               size="sm"
               className="h-8 px-2 text-xs border-dashed border-red-500/50 text-red-500 hover:text-red-600 hover:bg-red-500/10 ml-1"
               onClick={onPlayRecording}
               title="Play User Recording"
               disabled={isPlayingSong && currentSong?.id !== 'recording'}
             >
               <Play className="h-3 w-3 mr-1 fill-current" />
               <span className="hidden sm:inline">Play Rec</span>
             </Button>
          )}

          {isPlayingSong ? (
            <Button 
              variant="destructive" 
              size="sm" 
              className="h-8 px-3 ml-1" 
              onClick={onStopSong}
            >
              <Square className="h-3 w-3 mr-1" /> Stop
            </Button>
          ) : null}
        </div>


        <div className="h-4 w-px bg-border hidden md:block" />

        {/* Speed Control */}
        {onPlaybackSpeedChange && (
          <div className="flex items-center gap-2">
             <Select 
                value={playbackSpeed.toString()} 
                onValueChange={(v) => onPlaybackSpeedChange(parseFloat(v))}
             >
                <SelectTrigger className="w-[85px] h-8 text-xs bg-transparent border-transparent hover:bg-muted/50 transition-colors focus:ring-0">
                   <div className="flex items-center gap-1.5">
                      <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium">{playbackSpeed}x</span>
                   </div>
                </SelectTrigger>
                <SelectContent align="end">
                   {[0.5, 0.75, 1.0, 1.25, 1.5].map((speed) => (
                      <SelectItem key={speed} value={speed.toString()} className="text-xs">
                         {speed}x {speed === 1.0 ? '(Normal)' : speed < 1.0 ? '(Slow)' : '(Fast)'}
                      </SelectItem>
                   ))}
                </SelectContent>
             </Select>
          </div>
        )}
        
        <div className="h-4 w-px bg-border hidden md:block" />



        <div className="h-4 w-px bg-border hidden md:block" />

        <VolumeControl volume={volume} onVolumeChange={onVolumeChange} />
        
        <button
          onClick={onToggleTheme}
          className="theme-toggle"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Moon className="h-5 w-5 transition-transform duration-300" />
          ) : (
            <Sun className="h-5 w-5 transition-transform duration-300" />
          )}
        </button>
      </div>

      <Dialog open={showModeDialog} onOpenChange={setShowModeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Playback Mode</DialogTitle>
            <DialogDescription>
              How would you like to play <strong>{pendingSong?.name || pendingMidi?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
             <Button
                variant="outline"
                className="justify-start h-auto py-3 px-4 hover:border-primary/50 hover:bg-primary/5"
                onClick={() => handleModeConfirm('listen')}
             >
                <Play className="h-5 w-5 mr-3 text-cyan-500" />
                <div className="text-left">
                   <div className="font-semibold">Listen Mode</div>
                   <div className="text-xs text-muted-foreground">Auto-play the song. Sit back and enjoy.</div>
                </div>
             </Button>
             
             <Button
                variant="outline"
                className="justify-start h-auto py-3 px-4 hover:border-primary/50 hover:bg-primary/5"
                onClick={() => handleModeConfirm('study')}
             >
                <GraduationCap className="h-5 w-5 mr-3 text-primary" />
                <div className="text-left">
                   <div className="font-semibold">Study Mode</div>
                   <div className="text-xs text-muted-foreground">Interactive learning. The song waits for you.</div>
                </div>
             </Button>
          </div>
          <DialogFooter className="sm:justify-start">
             <Button type="button" variant="secondary" onClick={() => setShowModeDialog(false)}>
                Cancel
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
