import { useMemo } from 'react';
import type { CV } from '../data/cvModel';
import { getTheme } from '../data/themes';
import { paginateCV } from './pagination';
import { CVPage } from './CVPage';
import './cv.css';

interface CVRendererProps {
  cv: CV;
  photoUrl?: string;
  className?: string;
}

/** Pure, data-in/markup-out CV document. Used identically for the on-screen
 * preview and the print/PDF output so what the user previews is what they
 * download. */
export function CVRenderer({ cv, photoUrl, className }: CVRendererProps) {
  const theme = getTheme(cv.themeId);
  const pages = useMemo(() => paginateCV(cv), [cv]);

  const themeVars = {
    '--cv-primary': theme.primary,
    '--cv-accent': theme.accent,
    '--cv-text': theme.text,
    '--cv-text-secondary': theme.textSecondary,
  } as React.CSSProperties;

  return (
    <div className={`cv-document ${className ?? ''}`} style={themeVars}>
      {pages.map((page) => (
        <CVPage key={page.pageNumber} cv={cv} page={page} photoUrl={photoUrl} />
      ))}
    </div>
  );
}
