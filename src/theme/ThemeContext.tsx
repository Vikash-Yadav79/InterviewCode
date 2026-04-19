// src/theme/ThemeContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { Colors } from './colors';
import { Typography } from './typography';

interface ThemeContextType {
  colors: typeof Colors;
  typography: typeof Typography;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: Colors,
  typography: Typography,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ colors: Colors, typography: Typography }}>
      {children}
    </ThemeContext.Provider>
  );
};
