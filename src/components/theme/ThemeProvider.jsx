import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

/** @param {{children: import('react').ReactNode}} props */
const ThemeProvider = ({ children }) => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  return children;
};

export default ThemeProvider;
