# Chat widget

An "AI Laura" chat on the home page, backed by the Claude API.
Visitors chat with a version of Laura grounded entirely in `chat/facts.md`
— it can't invent projects, dates, or opinions that aren't in that file.

## Why it's here

This feature is itself evidence of product engineering: it's not just a
resume claim, it's a shipped, tested, guarded feature a recruiter can use.

## How it works

```
chat/
  facts.md               The only facts the AI can draw from. Edit this
                          whenever the story changes — new role, new
                          project, updated framing.
  system-prompt.md       Voice, tone, and guardrails: a deny-list, grounding
                          rules, contact handoff, and injection resistance.
scripts/
  build-chat-prompt.mjs  Bundles the two files above into
                          server/generated/chatPrompt.generated.ts. Runs
                          automatically via npm's prebuild/predev hooks —
                          you never need to remember to run it by hand.
server/
  generated/
    chatPrompt.generated.ts   Generated. Don't edit directly.
  services/
    chatAssistant.service.ts  Calls the Anthropic API, mirrors the
                               structure of email.service.ts.
    chatLog.service.ts        Logs each question (and whether it got a
                               real answer) to Upstash Redis — see
                               "Question log" below.
  utils/
    rateLimiter.ts             Extended with checkChatRateLimit alongside
                                the existing contact-form limiter (20
                                messages / 5 minutes per IP, its own
                                Upstash key prefix so it never shares a
                                bucket with the contact form).
shared/
  validators/
    chat.validator.ts          Zod schema for chat requests, same pattern
                                as contact.validator.ts.
app/api/chat/
  route.ts                     POST /api/chat. Rate limit -> validate ->
                                call the service -> respond, same shape as
                                app/api/contact/route.ts.
client/
  hooks/useChatBar.ts           Message state, expand/collapse/clear,
                                 history, send logic (in-memory only).
  components/ChatBar.tsx        Home hero input + inline expandable
                                 transcript under it (name/tagline stay
                                 visible), styled with the site's #41b390 accent.
```

`ChatBar` is mounted from `HomePage` on `/`. The hero keeps a compact
input; sending a question expands an inline panel under it with a short,
scrollable transcript and Clear control — short enough that the name and
tagline stay on screen above. Collapsing hides the panel but keeps the
thread (focus the input or "Show conversation" to reopen); Clear wipes it
and collapses. Conversations are capped at 12 messages (matching the Zod
schema) — when full, send is disabled until Clear.

## Setup

1. Get an API key at [console.anthropic.com](https://console.anthropic.com)
   (separate from a claude.ai login — this is billed per-token, but light
   portfolio traffic costs very little; the widget defaults to Claude
   Haiku and caps message and conversation length).
2. In Vercel: Project Settings → Environment Variables, add
   `ANTHROPIC_API_KEY`. The existing `UPSTASH_REDIS_REST_URL` /
   `UPSTASH_REDIS_REST_TOKEN` variables are reused automatically for chat
   rate limiting — no new Upstash setup needed.
3. Deploy. `npm run build` regenerates the prompt bundle automatically via
   the `prebuild` hook.

Locally: copy `.env.example` to `.env.local`, fill in
`ANTHROPIC_API_KEY` (Upstash vars are optional in development — rate
limiting no-ops without them, same as the existing contact form), then
`npm run dev`.

## Editing the story

1. Edit `chat/facts.md` and/or `chat/system-prompt.md`.
2. `npm run build-chat-prompt` (or just `npm run dev` / `npm run build`,
   which do it for you).
3. Commit the source edits. The generated
   `server/generated/chatPrompt.generated.ts` is gitignored — every
   environment (dev, CI, Vercel) regenerates it via the npm lifecycle
   hooks, so it never needs to be committed.

## Question log

Every successful chat turn appends an entry to the Redis list `chat:log`
(newest first, capped at 500 entries):

```json
{ "ts": "2026-08-09T18:49:00.000Z", "question": "What has she built?", "answered": true }
```

`answered` is a heuristic: it's `false` when the reply contains one of the
canned no-answer responses ("I'm not sure about that one..." from the
system prompt, or the empty-reply fallback). Unanswered questions are the
signal — they show what visitors ask that `chat/facts.md` doesn't cover
yet.

Logging is best-effort: it no-ops in development when the Upstash env
vars aren't set, and any Redis failure is swallowed so it can never break
a chat reply. Rate-limited and invalid requests are not logged.

## Guardrails (why this is safe to run publicly, with a public repo)

- **Deny-list**: age, birth year, graduation year, and any arithmetic that
  could back into them are refused — in a way that's worded identically
  to a genuine "I don't know," so nothing signals a topic is being
  deliberately hidden.
- **No speculation about current employment or Eco Pass internals**
  beyond what's explicitly in the facts pack.
- **Grounding**: nothing outside `chat/facts.md` gets stated as fact — the
  assistant redirects to `/contact` instead of guessing.
- **Prompt injection resistance**: the system prompt instructs the model
  to ignore instructions embedded in visitor messages.
- **Rate limiting + input caps**: 20 messages / 5 minutes per IP via
  Upstash (same infra as the contact form), plus message-length and
  conversation-length caps enforced by the shared Zod schema and mirrored
  in the client (12 messages max, Clear to continue).
- **Sanitized errors**: `app/api/chat/route.ts` reuses the same
  `handleError` utility as the contact route, so failures never leak
  implementation details to the client.

## Testing

```
npm test
```

Covers `shared/validators/chat.validator.ts` and `app/api/chat/route.ts`
(rate limiting, validation, success, and error paths), same pattern as
the existing contact form tests.
