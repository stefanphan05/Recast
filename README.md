# Message Rewriter (Next.js)

This app rewrites messages with better grammar and style presets:

- `Formal`
- `Casual`
- `GenZ` (with 0-10 intensity slider)
- `Flirt` (with 1-10 cringe intensity slider)

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

| Provider                                                  | Free tier signup     |
| --------------------------------------------------------- | -------------------- |
| [Google Gemini](https://aistudio.google.com/apikey)       | `GEMINI_API_KEY`     |
| [Groq](https://console.groq.com/)                         | `GROQ_API_KEY`       |
| [OpenRouter](https://openrouter.ai/) (use `:free` models) | `OPENROUTER_API_KEY` |
| [Cerebras](https://cloud.cerebras.ai/) (optional)         | `CEREBRAS_API_KEY`   |

Optional: `REWRITE_PROVIDER_ORDER=gemini,groq,openrouter` to control fallback order.

### Rate limiting

The rewrite API is limited to **5 requests per minute per IP** by default. Locally, limits are tracked in memory. On Vercel, add [Upstash Redis](https://upstash.com/) so limits apply across all serverless instances:

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Optional overrides: `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`.

### Google sign-in (optional)

Sign-in is **Google only** and optional — the rewriter works without an account. To enable it locally:

1. Create an [OAuth client](https://console.cloud.google.com/apis/credentials) (Web application).
2. Add **Authorized redirect URIs** (must match the URL and port you actually use):
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:3001/api/auth/callback/google` (if port 3000 is busy, Next.js uses 3001)
3. Add to `.env.local`:

```bash
AUTH_SECRET=   # openssl rand -base64 32
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_URL=http://localhost:3000   # use 3001 if dev runs on that port
```

If you see **Error 400: redirect_uri_mismatch**, the redirect URI in Google Console does not match your app URL (wrong port is the usual cause). Check the terminal for `Local: http://localhost:XXXX` and use that port in both `AUTH_URL` and Google Console.

On Vercel, add the production callback URL: `https://your-domain.vercel.app/api/auth/callback/google`.

### Stripe billing (Premium: A$10/month)

Add to `.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`NEXT_PUBLIC_APP_URL` should match your actual local dev URL/port.

The app creates a Stripe Checkout subscription session at runtime for **A$10 per month** and uses Stripe Customer Portal for subscription management.

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
  "style": "grammar | shorter | formal | casual | genz | flirt",
  "genzIntensity": 5,
  "flirtIntensity": 5
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
