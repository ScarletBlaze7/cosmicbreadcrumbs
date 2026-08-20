export type FontSizeSetting = 'comfortable' | 'large' | 'xlarge';

const FONT_SIZE_KEY = 'cosmic_font_size_preference';

export const getStoredFontSize = (): FontSizeSetting => {
  if (typeof window === 'undefined') return 'comfortable';
  try {
    const saved = localStorage.getItem(FONT_SIZE_KEY) as FontSizeSetting;
    if (saved === 'comfortable' || saved === 'large' || saved === 'xlarge') {
      return saved;
    }
  } catch (e) {}
  return 'comfortable';
};

export const applyFontSize = (setting: FontSizeSetting) => {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-font-size', setting);
  try {
    localStorage.setItem(FONT_SIZE_KEY, setting);
  } catch (e) {}
  window.dispatchEvent(new CustomEvent('cosmic-font-size-changed', { detail: setting }));
};

export const initFontSize = () => {
  const current = getStoredFontSize();
  applyFontSize(current);
  return current;
};
