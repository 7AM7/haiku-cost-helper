# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

A single-page cost calculator for estimating Claude Haiku 4.5 API costs in an educational/learning assistant context. Users configure parameters (student count, queries, context size, output length) via sliders and see real-time cost estimates with caching vs. non-caching comparisons.

## Commands

- `npm run dev` — Start dev server on port 8080
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run test` — Run tests once (vitest)
- `npm run test:watch` — Run tests in watch mode
- `npx vitest run src/test/example.test.ts` — Run a single test file

## Architecture

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui (Radix primitives)

**Routing:** react-router-dom with BrowserRouter in `App.tsx`. Add new routes above the `*` catch-all.

**Key application components** (in `src/components/`):
- `PriceCalculator.tsx` — Main component. Contains all pricing constants (`PRICING` object), state management, cost calculation logic (`calculateCost`), and the full UI. This is where the core business logic lives.
- `CostBreakdown.tsx` — Visual bar chart breakdown of cost categories, receives computed breakdown data as props.
- `PricingExplainer.tsx` — Static educational accordion explaining how Claude pricing/caching works.

**Pricing constants** are defined at the top of `PriceCalculator.tsx` (per-token rates for embed, input, output, cache write, cache read). The minimum cache token threshold is `MIN_CACHE_TOKENS = 4096`.

**UI components** in `src/components/ui/` are shadcn/ui generated — edit via `npx shadcn-ui@latest add <component>`, don't manually modify.

## Conventions

- Path alias: `@` maps to `./src` (configured in vite, vitest, and tsconfig)
- CSS variables for theming defined in `src/index.css`, consumed via Tailwind config
- `cn()` utility from `src/lib/utils.ts` for merging Tailwind classes
- Tests go in `src/**/*.{test,spec}.{ts,tsx}`, setup in `src/test/setup.ts` (jsdom environment with jest-dom matchers)
- ESLint has `@typescript-eslint/no-unused-vars` turned off
