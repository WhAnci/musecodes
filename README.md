# musecodes

A lightweight community utility for sharing Muse referral codes.

## Features

- Submit and browse 6-character Muse referral codes
- Copy codes and open Muse with one click
- Community feedback (Worked / Didn't Work) with abuse prevention
- Status labels derived from recent feedback
- Featured site owner code (S8D87N) clearly labeled at the top
- Search, sort, and individual code detail pages

## Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (PostgreSQL)
- [Vercel](https://vercel.com/) (deployment)

## Setup

### 1. Clone and install

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open the SQL Editor and run the migration in `supabase/migrations/001_initial_schema.sql`.
3. Copy your project URL and API keys from **Project Settings → API**.

### 3. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add the three environment variables from `.env.example`.
4. Deploy.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with featured code, search, stats, and community codes |
| `/submit` | Submit a new referral code |
| `/code/[code]` | Individual code details and feedback |
| `/about` | About and disclaimer |

## Database

- `referral_codes` — submitted codes with optional display name
- `feedback` — anonymous worked/failed reports (one per visitor per code)
- `rate_limits` — server-side rate limiting for submissions and feedback
- `referral_codes_with_stats` — view with aggregated feedback counts

## Security

- Server-side validation of all codes (`^[A-Z0-9]{6}$`)
- Duplicate code prevention
- One feedback vote per anonymous session per code
- IP-based rate limiting on submissions and feedback
- Display names sanitized (no HTML)
- Writes use service role key via API routes only
