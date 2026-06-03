# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

HL7 Decode is a web app that parses raw HL7 2.X messages and displays them as human-readable text. Users paste raw HL7 into a text area and get a structured, labeled breakdown of each segment, field, and value.

## Tech Stack

- **React + Vite** — frontend framework and dev server
- **Tailwind CSS** — utility-first styling, no custom CSS files
- **Functional components only** — no class components

## Commands

```bash
npm install          # install dependencies
npm run dev          # start Vite dev server
npm run build        # production build
npm run preview      # preview production build
npm run lint         # ESLint
```

## Git Workflow

- All work happens on feature branches cut from `main`
- Never commit directly to `main`
- Branch naming: `feat/description`, `fix/description`, `chore/description`

## Code Conventions

- Functional components with named exports
- Props typed with TypeScript interfaces
- Tailwind classes directly on JSX elements — no CSS modules, no `styled-components`
- HL7 parsing logic lives in `src/lib/` as pure functions, separate from React components
- Keep components in `src/components/`, page-level views in `src/pages/`
