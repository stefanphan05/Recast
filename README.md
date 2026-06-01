# Message Rewriter (Next.js)

This app rewrites messages with better grammar and style presets:

- `Formal`
- `Casual`
- `GenZ` (with 0-10 intensity slider)

It uses a Next.js API route (`/api/rewrite`) with **automatic AI provider fallback**. Configure one or more free-tier APIs; if Gemini runs out of quota, the app tries Groq, OpenRouter, and others in order.

## 1) Setup

Create your environment file:

```bash
cp .env.example .env.local
```

Add **at least one** API key in `.env.local` (more keys = more resilience when one hits limits):

```bash
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
OPENROUTER_API_KEY=your_openrouter_key
```

| Provider | Free tier signup |
|----------|------------------|
| [Google Gemini](https://aistudio.google.com/apikey) | `GEMINI_API_KEY` |
| [Groq](https://console.groq.com/) | `GROQ_API_KEY` |
| [OpenRouter](https://openrouter.ai/) (use `:free` models) | `OPENROUTER_API_KEY` |
| [Cerebras](https://cloud.cerebras.ai/) (optional) | `CEREBRAS_API_KEY` |

Optional: `REWRITE_PROVIDER_ORDER=gemini,groq,openrouter` to control fallback order.

### Rate limiting

The rewrite API is limited to **5 requests per minute per IP** by default. Locally, limits are tracked in memory. On Vercel, add [Upstash Redis](https://upstash.com/) so limits apply across all serverless instances:

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Optional overrides: `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`.

## 2) Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 3) API Contract

`POST /api/rewrite`

Request body:

```json
{
  "text": "string",
  "style": "grammar | shorter | formal | casual | genz",
  "genzIntensity": 5
}
```

Response body:

```json
{
  "text": "rewritten message"
}
```

## 4) Deploy to Vercel

1. Push this `frontend` project to GitHub.
2. Import it into Vercel.
3. Add environment variables:
   - At least one of `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY` (more is better)
   - `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (for rate limiting)
4. Deploy.
