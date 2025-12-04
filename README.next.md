# Monster Matchmaker - Next.js Application

This directory contains the Next.js web application for the Monster Matchmaker.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles with neon-gothic theme
│   ├── layout.tsx         # Root layout with theme
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utility functions and shared logic
├── types/                 # TypeScript type definitions
└── src/                   # Kiroween Kinship Engine core logic (existing)
```

## Getting Started

### Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
pnpm run build
pnpm run start
```

## Theme

The application uses a neon-gothic horror aesthetic with:
- Dark background colors (#0a0a0a, #1a1a1a)
- Electric violet accent (#8E48FF)
- Custom utilities: `text-glow`, `neon-border`, `neon-glow`

## Technology Stack

- **Next.js 16** with App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (CSS-based configuration)
- **Kiroween Kinship Engine** (core classification logic in `src/`)

## Next Steps

1. Implement API route at `app/api/matchmaker/route.ts`
2. Create quiz page components
3. Create results page components
4. Integrate Kiroween Kinship Engine with API routes
