import React from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
  };

  // Initialize theme on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-700 dark:text-white font-medium">Light</span>
      
      <button
        onClick={toggleTheme}
        className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50"
        style={{
          backgroundColor: theme === 'light' ? '#6B7280' : '#14B8A6'
        }}
      >
        {/* Toggle circle */}
        <div
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center"
          style={{
            transform: theme === 'light' ? 'translateX(2px)' : 'translateX(26px)'
          }}
        >
          {theme === 'light' ? (
            <Sun className="w-3 h-3 text-gray-600" />
          ) : (
            <Moon className="w-3 h-3 text-gray-600" />
          )}
        </div>
      </button>
      
      <span className="text-sm text-gray-700 dark:text-white font-medium">Dark</span>
    </div>
  );
}