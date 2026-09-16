import type { CV } from '../data/cvModel';
import { buildLeftBlocks, buildRightBlocks, type LeftBlock, type RightBlock } from './blocks';
import {
  estimateLeftBlockHeight,
  estimateRightBlockHeight,
  CONTENT_HEIGHT_FIRST_PAGE_MM,
  CONTENT_HEIGHT_OTHER_PAGE_MM,
} from './estimate';

export interface Page {
  pageNumber: number;
  isFirstPage: boolean;
  left: LeftBlock[];
  right: RightBlock[];
}

function packIntoPages<T>(
  blocks: T[],
  estimateHeight: (block: T) => number,
  firstPageHeight: number,
  otherPageHeight: number,
): T[][] {
  if (blocks.length === 0) return [];
  const pages: T[][] = [];
  let current: T[] = [];
  let currentHeight = 0;
  let pageIndex = 0;

  for (const block of blocks) {
    const capacity = pageIndex === 0 ? firstPageHeight : otherPageHeight;
    const blockHeight = estimateHeight(block);
    const wouldOverflow = current.length > 0 && currentHeight + blockHeight > capacity;

    if (wouldOverflow) {
      pages.push(current);
      current = [];
      currentHeight = 0;
      pageIndex += 1;
    }
    current.push(block);
    currentHeight += blockHeight;
  }

  if (current.length > 0) pages.push(current);
  return pages;
}

/**
 * Pure function: CV data in, an ordered list of Page descriptors out.
 * Both the on-screen preview and the print/PDF output render this same
 * Page[] via the same section components, so what the user previews is
 * exactly what they print.
 */
export function paginateCV(cv: CV): Page[] {
  const leftBlocks = buildLeftBlocks(cv);
  const rightBlocks = buildRightBlocks(cv);

  const leftPages = packIntoPages(leftBlocks, estimateLeftBlockHeight, CONTENT_HEIGHT_FIRST_PAGE_MM, CONTENT_HEIGHT_OTHER_PAGE_MM);
  const rightPages = packIntoPages(rightBlocks, estimateRightBlockHeight, CONTENT_HEIGHT_FIRST_PAGE_MM, CONTENT_HEIGHT_OTHER_PAGE_MM);

  const pageCount = Math.max(1, leftPages.length, rightPages.length);
  const pages: Page[] = [];
  for (let i = 0; i < pageCount; i += 1) {
    pages.push({
      pageNumber: i + 1,
      isFirstPage: i === 0,
      left: leftPages[i] ?? [],
      right: rightPages[i] ?? [],
    });
  }
  return pages;
}
