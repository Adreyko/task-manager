export enum Theme {
  light = 'app_theme_light',
  dark = 'app_theme_dark',
}

export interface ContextType {
  theme?: Theme;
  setTheme?: (theme: Theme) => void;
}
