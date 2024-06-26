import { type ReactNode, createContext, useMemo, useState } from 'react';
import { Theme, type ContextType } from '../types/theme';
import { THEME_LOCAL_STORAGE } from '@/shared/consts/storage';

export const ThemeContext = createContext<ContextType>({});

const initTheme =
  (localStorage.getItem(THEME_LOCAL_STORAGE) as Theme) || Theme.light;

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(initTheme);

  const value = useMemo(() => {
    return { theme, setTheme };
  }, [theme, setTheme]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
