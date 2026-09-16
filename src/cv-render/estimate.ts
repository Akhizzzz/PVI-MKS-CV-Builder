// Deterministic block-height estimator used to decide page breaks.
//
// This intentionally does not measure the live DOM: DOM measurement would
// tie pagination to render timing and viewport state. Instead heights are
// estimated from content (character counts at a known column width), which
// is a pure, unit-testable function of the CV data alone. Estimates are
// deliberately generous (rounded up, with buffers) so that a mis-estimate
// errs toward starting a new page rather than letting content overflow —
// combined with `break-inside: avoid` in print.css, this guarantees content
// is never clipped or overlapping even if an estimate is imperfect.
import type { LeftBlock, RightBlock } from './blocks';

const LINE_HEIGHT_MM = 4.6;
const HEADING_HEIGHT_MM = 8.5;
const ENTRY_HEADER_HEIGHT_MM = 9; // title/org + dates line for an entry
const ENTRY_GAP_MM = 5;
const BULLET_LINE_HEIGHT_MM = 4.4;

const LEFT_COL_CHARS_PER_LINE = 34;
const RIGHT_COL_CHARS_PER_LINE = 58;

function textLines(text: string, charsPerLine: number): number {
  if (!text.trim()) return 0;
  return Math.max(1, Math.ceil(text.length / charsPerLine));
}

function bulletsHeight(bullets: string[], charsPerLine: number): number {
  return bullets.reduce((sum, b) => sum + textLines(b, charsPerLine) * BULLET_LINE_HEIGHT_MM, 0);
}

export function estimateLeftBlockHeight(block: LeftBlock): number {
  switch (block.kind) {
    case 'profile':
      return HEADING_HEIGHT_MM + textLines(block.text, LEFT_COL_CHARS_PER_LINE) * LINE_HEIGHT_MM + ENTRY_GAP_MM;
    case 'skills': {
      const rows = Math.max(block.technical.length, block.workplace.length);
      return HEADING_HEIGHT_MM + rows * LINE_HEIGHT_MM + ENTRY_GAP_MM;
    }
    case 'languages':
      return HEADING_HEIGHT_MM + block.items.length * LINE_HEIGHT_MM + ENTRY_GAP_MM;
    case 'certifications-heading-first':
    case 'awards-heading-first':
      return HEADING_HEIGHT_MM + ENTRY_HEADER_HEIGHT_MM + ENTRY_GAP_MM;
    case 'certification':
    case 'award':
      return ENTRY_HEADER_HEIGHT_MM + ENTRY_GAP_MM;
    default:
      return ENTRY_HEADER_HEIGHT_MM;
  }
}

export function estimateRightBlockHeight(block: RightBlock): number {
  switch (block.kind) {
    case 'projects-heading-first':
      return HEADING_HEIGHT_MM + ENTRY_HEADER_HEIGHT_MM + bulletsHeight(block.first.bullets, RIGHT_COL_CHARS_PER_LINE) + ENTRY_GAP_MM;
    case 'project':
      return ENTRY_HEADER_HEIGHT_MM + bulletsHeight(block.item.bullets, RIGHT_COL_CHARS_PER_LINE) + ENTRY_GAP_MM;
    case 'experience-heading-first':
      return HEADING_HEIGHT_MM + ENTRY_HEADER_HEIGHT_MM + bulletsHeight(block.first.bullets, RIGHT_COL_CHARS_PER_LINE) + ENTRY_GAP_MM;
    case 'experience':
      return ENTRY_HEADER_HEIGHT_MM + bulletsHeight(block.item.bullets, RIGHT_COL_CHARS_PER_LINE) + ENTRY_GAP_MM;
    case 'education-heading-first':
      return HEADING_HEIGHT_MM + ENTRY_HEADER_HEIGHT_MM + bulletsHeight(block.first.points, RIGHT_COL_CHARS_PER_LINE) + ENTRY_GAP_MM;
    case 'education':
      return ENTRY_HEADER_HEIGHT_MM + bulletsHeight(block.item.points, RIGHT_COL_CHARS_PER_LINE) + ENTRY_GAP_MM;
    default:
      return ENTRY_HEADER_HEIGHT_MM;
  }
}

export const PAGE_WIDTH_MM = 210;
export const PAGE_HEIGHT_MM = 297;
export const PAGE_MARGIN_MM = 12;
export const HEADER_HEIGHT_MM = 46; // photo + name/title + contact bar, page 1 only

export const CONTENT_HEIGHT_FIRST_PAGE_MM = PAGE_HEIGHT_MM - PAGE_MARGIN_MM * 2 - HEADER_HEIGHT_MM;
export const CONTENT_HEIGHT_OTHER_PAGE_MM = PAGE_HEIGHT_MM - PAGE_MARGIN_MM * 2;
