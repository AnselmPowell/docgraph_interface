// src/app/components/main/ThemeToggle.client.jsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useApp } from '@/app/contexts/AppContext.client';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const { ui } = useApp();
  const [mounted, setMounted] = useState(false); 

  // Only show the toggle after mounting on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return null on server-side and first render
  }

  
  console.log("theme: ", ui.theme)

  return (
    <button
      onClick={ui.toggleTheme}
      className="p-2 rounded-md hover:bg-tertiary/20 transition-colors duration-200
                flex items-center justify-center gap-2"
      aria-label="Toggle theme"
    >
      {ui.theme === 'light' ? (
        <>
          <Moon className="h-5 w-5 text-secondary" />
          <span className="text-sm text-secondary">Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="h-5 w-5 text-secondary" />
          <span className="text-sm text-secondary">Light Mode</span>
        </>
      )}
    </button>
  );
}


