import { Header } from '@/components/Header';
import { Piano } from '@/components/Piano';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { useTheme } from '@/hooks/useTheme';
import { usePiano } from '@/hooks/usePiano';

const Index = () => {
  const { isDark, toggleTheme } = useTheme();
  const { volume, updateVolume, whiteKeys, blackKeys, activeKeys, isLoaded, playNote, stopNote } = usePiano();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark-gradient-bg' : ''}`}>
      <LoadingOverlay isLoading={!isLoaded} />
      
      <Header 
        isDark={isDark} 
        onToggleTheme={toggleTheme}
        volume={volume}
        onVolumeChange={updateVolume}
      />
      
      <main className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-12">
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-3">
            Play the Piano
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            A beautiful virtual piano experience. Use your keyboard or click the keys to create music.
          </p>
        </div>
        
        <Piano 
          whiteKeys={whiteKeys}
          blackKeys={blackKeys}
          activeKeys={activeKeys}
          isLoaded={isLoaded}
          playNote={playNote}
          stopNote={stopNote}
        />
        
        <footer className="mt-16 text-center">
          <p className="text-xs text-muted-foreground/50">
            Built with Salamander Grand Piano samples
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
