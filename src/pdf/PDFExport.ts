/** Opens the dedicated print-only view for a CV in a new tab, which
 * automatically triggers the browser print dialog (see PrintView.tsx).
 * The user picks "Save as PDF" as the destination to complete the export —
 * documented in-app and in the README as a known v1 limitation, since a
 * true forced download would require a JS PDF-rendering library that
 * degrades text/photo quality (see architecture plan §7). */
export function downloadCvAsPdf(cvId: string): void {
  window.open(`/cv/${cvId}/print`, '_blank', 'noopener');
}
