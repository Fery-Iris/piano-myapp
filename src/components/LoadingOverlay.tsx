import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

export function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-500">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-primary/20" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-xl font-semibold">Loading Sounds...</h3>
          <p className="text-sm text-muted-foreground">
            Preparing the Salamander Grand Piano
          </p>
        </div>
      </div>
    </div>
  );
}
