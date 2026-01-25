import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  const isMuted = volume <= -40;
  
  const handleVolumeChange = (values: number[]) => {
    onVolumeChange(values[0]);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onVolumeChange(isMuted ? -5 : -60)}
        className="p-1.5 rounded-md hover:bg-muted transition-colors"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>
      <Slider
        value={[volume]}
        onValueChange={handleVolumeChange}
        min={-40}
        max={10}
        step={1}
        className="w-20 md:w-24"
        aria-label="Volume"
      />
    </div>
  );
}
