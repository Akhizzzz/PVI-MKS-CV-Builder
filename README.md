# PVI CV Builder

A guided, account-free web app that lets Prakramika Vocational Institute (PVI)
professionals build a polished, colourful CV by filling in a structured form.
The app controls all layout and design — users only ever edit content.

## Project Purpose

Built so PVI professionals (including neurodivergent and special-learning-needs
users) can produce a professional CV without needing any design skills. Users
never move, resize, or reposition anything — the app automatically lays out
and paginates the CV as content is entered.

## How to Run Locally

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## How to Install Dependencies

```bash
npm install
```

## How to Build

```bash
npm run build
```

Outputs a static production build to `dist/`, deployable to any static host.

## How IndexedDB Persistence Works

- `src/storage/db.ts` defines a [Dexie](https://dexie.org) database
  (`pvi-cv-builder`) with two tables:
  - `cvs` — one record per CV (personal details, sections, theme, timestamps).
  - `photos` — uploaded/cropped profile photos, stored as `Blob`s and
    referenced from a CV's `personalDetails.photo.blobId`. Keeping photos in
    a separate table (rather than inlining base64 in the CV record) keeps
    the CV list fast to load and avoids base64 bloat.
- `src/storage/StorageService.ts` defines the persistence interface the rest
  of the app depends on; `src/storage/indexedDbStorage.ts` is the only
  implementation in v1. A future cloud-backed implementation can satisfy the
  same interface without touching any editor/renderer code (see "Future
  Cloud-Storage Migration Notes" below).
- `src/hooks/useAutosave.ts` debounces writes (800ms after the last change)
  so nothing is ever lost and there's no explicit Save button.
- All data stays on the user's device. Nothing is uploaded anywhere.

## How to Add/Edit Colour Themes

Every theme lives in one place: `src/data/themes.ts`. Each entry is:

```ts
{ id, name, primary, accent, text, textSecondary }
```

`CVRenderer` applies a theme's colours as CSS custom properties
(`--cv-primary`, `--cv-accent`, `--cv-text`, `--cv-text-secondary`) on the CV
document root — no other file needs to change to add, remove, or tweak a
theme. `ThemeSelector` renders the `THEMES` array automatically.

## How CV Data Is Structured

The full data model is in `src/data/cvModel.ts` (the `CV` interface). At a
glance: personal details + photo reference, profile text, technical/workplace
skills, languages, projects, work experience, education, certifications, and
awards — each repeatable section is an array of objects with a stable `id`.
Empty sections/arrays are simply omitted from the rendered CV.

## How PDF Generation Works

PDF export uses the browser's native print-to-PDF, not a JS PDF library
(which would rasterize text/photos and fight the CSS layout):

1. "Download PDF" (`src/pdf/PDFExport.ts`) opens a dedicated route,
   `/cv/:id/print` (`src/components/review/PrintView.tsx`), in a new tab.
   That route renders **only** the CV document — no app chrome, no form
   labels — and automatically opens the browser's print dialog once fonts
   and the photo have loaded.
2. `src/styles/print.css` sets `@page { size: A4; margin: 0 }` and hides
   anything outside the CV document.
3. The user chooses **"Save as PDF"** as the print destination to complete
   the download.

**Known limitation:** because this relies on the OS/browser print dialog
rather than a forced file download, the exact wording and steps differ
slightly by browser. This is disclosed in-app ("choose Save as PDF as the
destination"). Tested in Chrome and Edge.

### Automatic Layout & Pagination

- `src/cv-render/blocks.ts` splits a CV into two independent ordered
  "block" streams — one for the narrow left column (Profile, Skills,
  Languages, Certifications, Awards), one for the wide right column
  (Projects, Work Experience, Education). A section heading is always
  bundled with its first entry as one atomic block, so a heading can never
  be stranded alone at the bottom of a page.
- `src/cv-render/estimate.ts` + `src/cv-render/pagination.ts` estimate each
  block's printed height from its content (character/line counts at the
  column's known width) and greedily pack blocks into page buckets — a
  pure, deterministic `paginateCV(cv) => Page[]` function with no DOM
  dependency, so it's trivially unit-testable.
- The exact same `Page[]` and `CVRenderer` are used for the on-screen
  preview and the print/PDF output, so the preview is always accurate.
- Font sizes never shrink to fit content — see `src/styles/theme.css` for
  the fixed typographic scale. If content doesn't fit, a new page is added
  instead.
- As a real-print safety net, `src/cv-render/cv.css` also sets
  `break-inside: avoid` on every entry and `break-after: avoid` on every
  heading, and each page's box uses `min-height` (never a hard `height`),
  so even an imperfect height estimate can never cause clipped, overlapping,
  or lost content — at most a page renders slightly taller than one A4 sheet
  in a rare edge case, which is preferred over any data loss.

## How to Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, "Add New Project" → import the GitHub repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output
   directory: `dist`.
4. Deploy — no environment variables or backend services are required.

## Known Limitations (v1)

- PDF export depends on the browser's print dialog ("Save as PDF"), not a
  one-click forced download.
- Pagination heights are estimated from content, not measured live in the
  DOM; in rare cases a page may render marginally taller than exactly one
  A4 sheet rather than perfectly filling it (never overlapping or clipped
  content — see above).
- No account/cloud sync in v1 — CVs live only in the current browser's
  IndexedDB on the current device. Use **Export Backup** regularly.

## Future Cloud-Storage Migration Notes

Persistence is fully abstracted behind `StorageService`
(`src/storage/StorageService.ts`). A v2 cloud-backed store (e.g. behind a
magic-link auth flow) can implement the same interface and be swapped in
without changing any editor, renderer, or form component. `BackupService`'s
JSON export format can also double as the payload shape for a future
sync/upload endpoint.
