import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export const ThemeContext = createContext({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
  toggleTheme: () => {}
});

const STORAGE_KEY = 'mbda-theme';

const getSystemTheme = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

/** @param {{children: import('react').ReactNode}} props */
export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEY) || 'system');
  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    const next = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const next = mq.matches ? 'dark' : 'light';
      setResolvedTheme(next);
      document.documentElement.setAttribute('data-theme', next);
    };
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light'));
  }, []);

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme, toggleTheme }), [theme, resolvedTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
