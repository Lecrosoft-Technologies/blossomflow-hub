import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="relative w-12 h-12 rounded-full border-2 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 hover:bg-card/70 transition-all duration-300 group overflow-hidden"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-primary group-hover:text-primary" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-primary group-hover:text-primary" />
      
      {/* Crazy animated background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse-glow"></div>
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};