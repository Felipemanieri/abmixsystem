import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Light</span>
      
      <button
        onClick={toggleTheme}
        className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
        style={{
          backgroundColor: theme === 'light' ? '#6B7280' : '#059669'
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
      
      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Dark</span>
    </div>
  );
}