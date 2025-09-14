import React, { createContext, useContext, useEffect } from 'react';

interface ThemeContextValue {
  theme: 'light';
  actualTheme: 'light';
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Ensure light mode is always applied
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
  }, []);

  const value: ThemeContextValue = {
    theme: 'light',
    actualTheme: 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}