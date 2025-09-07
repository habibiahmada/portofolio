'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-full cursor-pointer transition-colors duration-500 ease-in-out"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 transition-transform duration-500 ease-in-out rotate-0 group-hover:rotate-12" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-500 ease-in-out rotate-0 group-hover:-rotate-12" />
      )}
    </Button>
  );
}
