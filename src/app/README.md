# App Router Directory

## Responsibility
Contains Next.js 15 App Router routing entrypoints, layout configurations, global styling, and Server Actions.

## Structure
- `/layout.tsx`: Root layout template, sets up global HTML/body, fonts, and meta tags.
- `/page.tsx`: Home page view (MonsoonMate AI main dashboard).
- `/globals.css`: TailwindCSS directives and variables for light/dark modes.
- `/actions/`: Next.js Server Actions for secure backend logic (e.g., calling Gemini API securely without exposing keys).
