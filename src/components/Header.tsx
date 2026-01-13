import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Header({ isDark, onToggleTheme }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Piano
        </h1>
        <span className="text-sm font-light text-muted-foreground tracking-widest uppercase">
          Virtual
        </span>
      </div>
      
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
    </header>
  );
}
