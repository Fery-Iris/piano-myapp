import { Header } from '@/components/Header';
import { Piano } from '@/components/Piano';
import { CircularPiano } from '@/components/CircularPiano';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { LandscapePrompt } from '@/components/LandscapePrompt';
import { useTheme } from '@/hooks/useTheme';
import { usePiano } from '@/hooks/usePiano';
import { useState } from 'react';
import { FloatingNotes } from '@/components/FloatingNotes';

const Index = () => {
  const { isDark, toggleTheme } = useTheme();
  const [pianoMode, setPianoMode] = useState<'classic' | 'circular'>('classic');
  const { 
    volume, 
    updateVolume, 
    whiteKeys, 
    blackKeys, 
    activeKeys, 
    isLoaded, 
    playNote, 
    stopNote,
    isSustainActive,
    playSong,
    stopSong,
    isPlayingSong,
    currentSong,
    playMidiFile,
    isRecording,
    startRecording,
    stopRecording,
    playRecording,
    recordedNotes,
    isLearnMode,
    setIsLearnMode,
    playbackSpeed,
    setPlaybackSpeed
  } = usePiano();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark-gradient-bg' : 'light-gradient-bg'}`}>
      <LoadingOverlay isLoading={!isLoaded} />
      <LandscapePrompt />
      <div className="hidden sm:block">
        <FloatingNotes />
      </div>
      
      <Header 
        isDark={isDark} 
        onToggleTheme={toggleTheme}
        volume={volume}
        onVolumeChange={updateVolume}
        onPlaySong={playSong}
        onStopSong={stopSong}
        isPlayingSong={isPlayingSong}
        currentSong={currentSong}
        onPlayMidi={playMidiFile}
        isRecording={isRecording}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onPlayRecording={playRecording}
        hasRecording={recordedNotes.length > 0}
        isLearnMode={isLearnMode}
        onSetLearnMode={setIsLearnMode}
        playbackSpeed={playbackSpeed}
        onPlaybackSpeedChange={setPlaybackSpeed}
      />
      
      <main className="flex min-h-screen flex-col items-center justify-center px-4 pt-32 landscape:pt-16 md:pt-28 pb-4 landscape:pb-2">
        <div className={`mb-10 text-center relative transition-all duration-500 ${isPlayingSong ? 'opacity-0' : 'opacity-100'}`}>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-3">
            Play the Piano
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-6">
            A beautiful virtual piano experience. Use your keyboard or click the keys to create music.
          </p>
          
          {/* Mode Toggle */}
          <div className="inline-flex items-center justify-center p-1 bg-muted/50 rounded-lg border border-border/50 backdrop-blur-sm shadow-inner relative z-10">
            <button
              onClick={() => setPianoMode('classic')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${pianoMode === 'classic' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            >
              Classic
            </button>
            <button
              onClick={() => setPianoMode('circular')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${pianoMode === 'circular' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            >
              Circular
            </button>
          </div>

          {/* Sustain Pedal Indicator */}
          <div className="absolute -bottom-12 left-0 right-0 flex justify-center">
            <div className={`
              text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full transition-all duration-300
              ${isSustainActive 
                ? 'bg-primary text-primary-foreground opacity-100 transform scale-100 shadow-md' 
                : 'bg-muted text-muted-foreground opacity-0 transform scale-90'
              }
            `}>
              Pedal: ON
            </div>
          </div>
        </div>
        
        <div className="w-full mt-4">
          {pianoMode === 'classic' ? (
            <Piano 
              whiteKeys={whiteKeys}
              blackKeys={blackKeys}
              activeKeys={activeKeys}
              isLoaded={isLoaded}
              playNote={playNote}
              stopNote={stopNote}
              currentSong={currentSong}
              isPlayingSong={isPlayingSong}
            />
          ) : (
            <CircularPiano 
              whiteKeys={whiteKeys}
              activeKeys={activeKeys}
              isLoaded={isLoaded}
              playNote={playNote}
              stopNote={stopNote}
              currentSong={currentSong}
              isPlayingSong={isPlayingSong}
            />
          )}
        </div>
        
        <footer className="mt-16 text-center">
          <p className="text-xs text-muted-foreground/50">
            Built With Fery 2026
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
