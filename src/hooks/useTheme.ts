import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
       // Check if user has explicitly set preference, otherwise default to TRUE
       const isDarkClass = document.documentElement.classList.contains('dark');
       // If class is present, use it. If not, default to true unless explicitly removed?
       // Simplest approach for "default dark": return true.
       return true; 
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return { isDark, toggleTheme };
}
