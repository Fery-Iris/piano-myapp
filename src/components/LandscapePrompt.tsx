import { Smartphone } from 'lucide-react';

export function LandscapePrompt() {
  return (
    <div className="fixed inset-0 z-[100] hidden flex-col items-center justify-center bg-background/95 backdrop-blur-xl p-6 text-center portrait:flex md:hidden">
      <div className="mb-6 animate-pulse">
        <Smartphone className="h-16 w-16 rotate-90 text-primary" strokeWidth={1.5} />
      </div>
      <h2 className="mb-2 font-display text-2xl font-bold tracking-tight">
        Please Rotate Your Device
      </h2>
      <p className="max-w-[260px] text-muted-foreground">
        This piano experience is designed for landscape mode. Rotate your phone for the best experience.
      </p>
    </div>
  );
}
