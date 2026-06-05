# Developer Portfolio

A minimal personal portfolio built with Next.js 14, React, and TypeScript. Features a contact form backed by Resend, per-IP rate limiting via Upstash Redis, and shared Zod validation between client and server.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Email**: Resend
- **Rate limiting**: Upstash Redis
- **Validation**: Zod (shared between client and server)
- **Font**: Oswald (Google Fonts)

## React patterns

- Custom hook (`useContactForm`) encapsulates all form state, debounced validation, and submission logic
- Shared Zod schema validates the same rules on both client (before fetch) and server (API route)
- `ConditionalFooter` uses `usePathname` to hide the footer on the contact page without duplicating layouts
- `ParticleScripts` sequences dependent script loading via `next/script` and state

## Project structure

```
app/          Next.js routes and API handlers
client/       React components, hooks, types, and site config
  components/
  hooks/
  types/
  site.config.ts   ← personal data lives here
server/       Server-only utilities (email service, rate limiter, error handler)
shared/       Code shared between client and server (Zod validators)
public/       Static assets (particle scripts)
```

## Configuration

### Personal data

Edit `client/site.config.ts` to set your name, tagline, and social links:

```ts
const siteConfig = {
  name: 'Your Name',
  tagline: 'Your tagline',
  social: {
    linkedin: 'https://linkedin.com/in/yourprofile',
    github: 'https://github.com/yourusername',
    twitter: 'https://x.com/yourhandle',
  },
  metadata: {
    title: 'Your Name',
    description: 'Your description',
  },
};
```

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes | Resend API key |
| `RESEND_FROM_EMAIL` | Yes | Sender address (must be a Resend-verified domain), e.g. `Your Name <you@yourdomain.com>` |
| `RESEND_TO_EMAIL` | Yes | Where contact form submissions go |
| `KV_REST_API_URL` | Production | Upstash Redis URL for rate limiting |
| `KV_REST_API_TOKEN` | Production | Upstash Redis token |

Rate limiting is silently disabled in development if the Upstash variables are not set.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Deploy to Vercel and set the environment variables in the project settings. The Upstash Redis variables are required in production — the app will throw on startup without them.
