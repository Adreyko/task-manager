import { useContext } from 'react';
import { ThemeContext } from '../component/ThemeProvider';
import { Theme } from '../types/theme';
import { THEME_LOCAL_STORAGE } from '@/shared/consts/storage';

export const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const newTheme = theme === Theme.light ? Theme.dark : Theme.light;
  const toggleTheme = () => {
    setTheme?.(newTheme);
    localStorage.setItem(THEME_LOCAL_STORAGE, newTheme);
  };

  return { theme, toggleTheme };
};
