import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const iconForTheme = {
  light: Sun,
  dark: Moon,
  system: Monitor
};

/** @param {{className?: string}} props */
const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const Icon = iconForTheme[theme] || Monitor;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text transition hover:bg-surface-2 ${className}`}
      aria-label={`Current theme: ${theme}. Toggle theme`}
      title={`Theme: ${theme}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="h-4 w-4" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
