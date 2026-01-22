import { Header } from '@/components/Header';
import { Piano } from '@/components/Piano';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { LandscapePrompt } from '@/components/LandscapePrompt';
import { useTheme } from '@/hooks/useTheme';
import { usePiano } from '@/hooks/usePiano';

import { FloatingNotes } from '@/components/FloatingNotes';

const Index = () => {
  const { isDark, toggleTheme } = useTheme();
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
    setIsLearnMode
  } = usePiano();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark-gradient-bg' : 'light-gradient-bg'}`}>
      <LoadingOverlay isLoading={!isLoaded} />
      <LandscapePrompt />
      <FloatingNotes />
      
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
      />
      
      <main className="flex min-h-screen flex-col items-center justify-center px-4 pt-48 landscape:pt-24 md:pt-28 pb-12"> {/* increased pt for mobile header, less for landscape */}
        <div className={`mb-10 text-center relative transition-all duration-500 ${isPlayingSong ? 'opacity-0' : 'opacity-100'}`}>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-3">
            Play the Piano
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            A beautiful virtual piano experience. Use your keyboard or click the keys to create music.
          </p>

          {/* Sustain Pedal Indicator */}
          <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
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
