# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **UMET theme** for DSpace Angular — a customized Angular UI for the DSpace 7.x institutional repository, used by Universidad Metropolitana (UMET). The working directory is `/src/themes/umet` within the broader DSpace Angular application at `/home/dspace/dspace-angular`.

## Common Commands

Run from `/home/dspace/dspace-angular`:

```bash
yarn start              # Build production + SSR and serve
yarn start:dev          # Development mode with hot reload
yarn build:prod         # Full production SSR build
yarn build:ssr          # Angular SSR build + Node server build
yarn serve:ssr          # Run compiled SSR server
yarn test               # Run unit tests (headless Karma/Jasmine)
yarn test:watch         # Run tests in watch mode
yarn lint               # ESLint
yarn e2e                # Cypress E2E tests
```

To run a single test file:
```bash
yarn test --include='**/path/to/component.spec.ts'
```

## Theme Override Architecture

The UMET theme uses DSpace Angular's **multi-theme override system**:

- Each component in `app/` mirrors the path of the core app component it overrides (e.g., `app/home-page/home-page.component.ts` overrides the core `src/app/home-page/`)
- Components are registered in two module files:
  - `eager-theme.module.ts` — components loaded on first page render (Header, Navbar, Footer, Home News)
  - `lazy-theme.module.ts` — all other components, loaded on demand
- To override a component: create a new component in the matching path under `app/`, extend the core component class, and declare it in the appropriate theme module

## Styling System

SCSS files in `styles/`:
- `theme.scss` — master import file
- `_theme_sass_variable_overrides.scss` — Bootstrap/SCSS variable customization (loaded first)
- `_theme_css_variable_overrides.scss` — CSS custom properties for runtime theming
- `_global-styles.scss` — UMET-specific global CSS rules

**UMET Color Palette:**
- `#00253c` — UMET Space (primary, dark blue)
- `#22bcb9` — UMET Nova (secondary, teal)
- `#bfd730` — UMET Zen (success, lime green)
- `#eaeff2` — UMET Marfil (light background)

**Typography:** Montserrat (Google Fonts, weights 300–900)

## Key Custom Features

**Home Page Statistics** (`app/home-page/home-page.component.ts`): Fetches live stats from the DSpace REST API — total documents, authors, collections, and downloads — and displays them in a hero dashboard. API calls use Angular's `HttpClient` with RxJS.

## Tech Stack

- **Angular** 15.2.8, **TypeScript** 4.8.4
- **Node** v16 or v18, **Yarn** 1.x
- **Bootstrap** 4.6.1, **ng-bootstrap** 11
- **NgRx** 15.4 (state management), **RxJS** 7.8
- **Angular Universal** (SSR), **ngx-translate** (i18n)
- Unit tests: **Jasmine/Karma**; E2E: **Cypress**

## Configuration

- Theme SCSS is bundled as `umet-theme` in `angular.json`
- DSpace REST API URL and other environment settings are in `config/default.yml` (at repo root) and `src/environments/`
- Theme is activated via the `themes` array in the configuration
