# Developer Portfolio

[![CI](https://github.com/LQuintero/personal-page/actions/workflows/ci.yml/badge.svg)](https://github.com/LQuintero/personal-page/actions/workflows/ci.yml)

**Live at [lauraq.co](https://lauraq.co)**

A minimal personal portfolio built with Next.js 14, React, and TypeScript. Features a contact form backed by Resend, an AI chat assistant grounded in a curated facts pack, per-IP rate limiting via Upstash Redis, and shared Zod validation between client and server.

<!-- TODO: add a screenshot or GIF of the homepage + chat widget here, e.g.:
![Homepage with chat widget](docs/assets/homepage.png)
-->

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI chat**: Claude API, grounded in a facts pack — see [`docs/CHAT_WIDGET.md`](docs/CHAT_WIDGET.md)
- **Email**: Resend
- **Rate limiting**: Upstash Redis
- **Validation**: Zod (shared between client and server)
- **Font**: Oswald (Google Fonts)

## React patterns

- Custom hooks (`useContactForm`, `useChatBar`) each encapsulate all state, validation, and submission logic for their feature — same pattern applied consistently across the contact form and the chat assistant
- Shared Zod schemas validate the same rules on both client (before fetch) and server (API route), for both the contact form and chat requests
- A `(main)` route group scopes the `Footer` to the home page via its own layout, so `/contact` never renders it — no client-side pathname check needed
- `ParticleScripts` sequences dependent script loading via `next/script` and state

## Project structure

```
app/          Next.js routes and API handlers (contact, chat)
chat/         Source of truth for the chat assistant's behavior
  facts.md          The only facts the assistant can draw from
  system-prompt.md  Voice, guardrails, deny-list
client/       React components, hooks, types, and site config
  components/
  hooks/
  types/
  site.config.ts   ← personal data lives here
scripts/      Build-time codegen (bundles chat/*.md into a TS constant)
server/       Server-only utilities (email service, chat service, rate limiter, error handler)
shared/       Code shared between client and server (Zod validators)
public/       Static assets (particle background: soulwire's sketch.js, MIT)
docs/         Feature documentation (chat widget)
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

Edit `chat/facts.md` and `chat/system-prompt.md` to set what the chat assistant knows and how it behaves — see [`docs/CHAT_WIDGET.md`](docs/CHAT_WIDGET.md) for details.

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
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key, powers the chat assistant |
| `CHAT_MODEL` | No | Overrides the default chat model |
| `UPSTASH_REDIS_REST_URL` | Production | Upstash Redis URL for rate limiting (shared by the contact form and chat) and the chat question log |
| `UPSTASH_REDIS_REST_TOKEN` | Production | Upstash Redis token |

Rate limiting and the chat question log are silently disabled in development if the Upstash variables are not set.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your values
npm run dev
```

`npm run dev` automatically regenerates the chat assistant's bundled prompt from `chat/*.md` before starting (via npm's `predev` hook) — no separate build step to remember.

Open [http://localhost:3000](http://localhost:3000).

## Testing

Unit tests cover the Zod validation schemas, both API routes' rate-limit/validation/success branches (contact and chat), the chat question log's answered heuristic, and the `useChatBar` hook — including the race guard that keeps an in-flight reply from repopulating a cleared thread:

```bash
npm test         # run once
npm run test:watch
```

## Deploy

Deploy to Vercel and set the environment variables in the project settings. The Upstash Redis variables are required in production — API routes will fail at the first request without them. `npm run build` regenerates the chat assistant's prompt bundle automatically (via npm's `prebuild` hook).

## License

[MIT](LICENSE)
