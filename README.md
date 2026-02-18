## Voice Productivity Platform

AI-powered voice assistant that turns quick voice notes into polished emails, meeting minutes, and short messages. Built with Next.js, React, and Tailwind CSS.

### Tech Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS with custom Noiz color system
- Shadcn UI components (buttons, cards, tabs, dialogs, etc.)
- lucide-react icons

### Getting Started

1. Install dependencies (uses pnpm lockfile):

```bash
pnpm install
```

2. Run the development server:

```bash
pnpm dev
```

The app will normally be available at http://localhost:3000.

### Available Scripts

- `npm run dev` / `pnpm dev` – start the dev server
- `npm run build` – production build
- `npm run start` – start built app
- `npm run lint` – run Next.js linting

### Main Screens

- `/` – Landing page with hero, Quick Actions, and Recent Activity
- `/recorder` – Voice recorder flow (record → review → choose output)
- `/templates` – Template gallery with filters (emails, meeting notes, messages)
- `/knowledge` – Library of generated outputs and uploaded documents

### Environment Variables

The project expects environment variables in `.env` (and optional `.env.local`). Do not commit these files. Add any API keys or secrets there following your deployment provider’s guidelines.

### Deployment Notes

- Build with `npm run build` or `pnpm build`
- Run with `npm run start` behind your preferred process manager or hosting platform

