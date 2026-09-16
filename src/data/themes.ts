import type { ThemeId } from './cvModel';

export interface Theme {
  id: ThemeId;
  name: string;
  /** Deep background colour for the CV document. */
  primary: string;
  /** Divider / accent / small-heading colour. */
  accent: string;
  /** Primary text colour on the primary background. */
  text: string;
  /** Secondary / muted text colour on the primary background. */
  textSecondary: string;
}

// Single source of truth for every curated CV colour theme. Adding a new
// theme later is a one-entry addition here — nothing else needs to change.
export const THEMES: Theme[] = [
  {
    id: 'pvi-classic',
    name: 'PVI Classic',
    primary: '#12468A',
    accent: '#F7DF7C',
    text: '#FFFFFF',
    textSecondary: '#E7EDF5',
  },
  {
    id: 'deep-teal-sand',
    name: 'Deep Teal & Sand',
    primary: '#164E59',
    accent: '#E5D5B5',
    text: '#FFFFFF',
    textSecondary: '#E7EFEF',
  },
  {
    id: 'burgundy-champagne',
    name: 'Burgundy & Champagne',
    primary: '#6B2737',
    accent: '#E8D6B3',
    text: '#FFFFFF',
    textSecondary: '#F0E7E8',
  },
  {
    id: 'charcoal-sage',
    name: 'Charcoal & Sage',
    primary: '#30363D',
    accent: '#B9C8B2',
    text: '#FFFFFF',
    textSecondary: '#E4E7E9',
  },
  {
    id: 'navy-powder-blue',
    name: 'Navy & Powder Blue',
    primary: '#17324D',
    accent: '#B8CEDD',
    text: '#FFFFFF',
    textSecondary: '#E4ECF2',
  },
  {
    id: 'forest-beige',
    name: 'Forest & Warm Beige',
    primary: '#284B3F',
    accent: '#D9C9A5',
    text: '#FFFFFF',
    textSecondary: '#E8EEEA',
  },
  {
    id: 'slate-dusty-rose',
    name: 'Slate & Dusty Rose',
    primary: '#3E4854',
    accent: '#D7B7B2',
    text: '#FFFFFF',
    textSecondary: '#E8EAED',
  },
];

export const DEFAULT_THEME_ID: ThemeId = 'pvi-classic';

export function getTheme(id: ThemeId): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
