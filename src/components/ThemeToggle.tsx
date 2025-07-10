
import { Moon, Sun, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="w-10 h-10 p-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm"
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
    >
      {isDark ? (
        <Sparkles className="w-6 h-6 text-yellow-500" />
        // <Sun className="h-4 w-4 text-yellow-500" />
      ) : (
        <Sparkles className="w-6 h-6 text-vilo-purple-200" />
        // <Moon className="h-4 w-4 text-gray-700" />
      )}
    </Button>
  );
};

export default ThemeToggle;
