export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'wg_theme';

export function getInitialTheme(): ThemeMode {
  // Enforce premium dark theme by default
  return 'dark';
}

export function applyTheme(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.add('dark');
  try {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
  } catch (err) {
    console.warn('Could not persist theme to localStorage', err);
  }
}
