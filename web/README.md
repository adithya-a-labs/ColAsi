# ColAsi Academic OS — Web

A responsive, local-first web evolution of the ColAsi Expo application.

## Included in this foundation

- Responsive desktop, tablet and mobile dashboard
- Configurable per-course attendance requirements
- Attendance percentage, safe-bunk and recovery calculations
- One-click class attendance logging
- Local browser persistence
- Timetable and upcoming-deadline summaries
- Installable PWA metadata
- Existing Expo mobile application remains untouched

## Run locally

```bash
cd web
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Architecture direction

This release intentionally uses browser storage so the interface can be validated without infrastructure. The next production milestone should replace the local adapter with Supabase/PostgreSQL, add authentication and row-level security, and implement relational semesters, courses, class sessions, syllabus topics, academic events and resources.
