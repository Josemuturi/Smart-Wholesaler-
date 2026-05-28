/**
 * ThemeContext.jsx — Smart Wholesaler Theme Manager
 * ---------------------------------------------------
 * Provides a global dark / light mode toggle.
 * - Preference is persisted in localStorage under "sw_theme"
 * - The chosen theme is applied as a data-theme attribute on <html>
 *   so all CSS variables update automatically
 *
 * Usage in any component:
 *   const { theme, toggleTheme } = useTheme();
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'sw_theme';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Restore from localStorage, fallback to system preference, then dark
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  });

  // Apply the theme to <html data-theme="..."> whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside <ThemeProvider>. Check your App.jsx.');
  }
  return context;
};

export default ThemeContext;
