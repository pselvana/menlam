# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Prettier check + ESLint
npm run format     # Auto-format with Prettier
```

No test suite is configured.

## Architecture

This is a **SvelteKit 2 + Svelte 5** app styled with **Tailwind CSS 4** and **DaisyUI 5** (emerald theme). It's a medical reference tool for Bhutan infectious disease treatment guidelines.

### Data Layer

All antibiotic data lives in [static/antibiotics.csv](static/antibiotics.csv). The CSV has these columns: `Patient`, `Section`, `Section Remarks`, `Infection`, `Infection Remarks`, `Type`, `Common Causative Agents`, `Recommended Antibiotic Therapy`, `Alternative Antibiotic Therapy`, `Recommended Duration of Treatment`, `Remarks`.

Data is loaded client-side at runtime via [src/routes/treatments/csvLoader.js](src/routes/treatments/csvLoader.js) using `papaparse`. Currently only the "Adult" patient category has data; Pediatrics and Neonates are marked coming soon.

### Routes

- `/` — Home/landing page
- `/treatments` — Hub page with two search options
- `/treatments/recommendation` — Hierarchical body-system search (Patient → Section → Infection → Details)
- `/treatments/search` — Full-text keyword search with regex support, pagination, sortable columns, and row detail modal
- `/about` — About page
- `/terms` — Terms of use

### Key Components

- [src/lib/DosageCalculator.svelte](src/lib/DosageCalculator.svelte) — Floating drawer calculator (weight × mg/kg), available on treatment pages
- [src/routes/+layout.svelte](src/routes/+layout.svelte) — Root layout with responsive navbar (mobile drawer + desktop nav) and PostHog initialization
- [src/routes/+layout.js](src/routes/+layout.js) — Client-side PostHog setup with page view tracking

### Analytics

PostHog keys are stored in `.env`. The server-side client is initialized in [src/lib/server/posthog.js](src/lib/server/posthog.js). The `svelte.config.js` sets `paths.relative: false` specifically for PostHog session replay compatibility.

### Styling

DaisyUI is configured in [src/app.css](src/app.css) with the `emerald` theme as default and dark mode preference. Use DaisyUI component classes wherever possible before reaching for raw Tailwind.
