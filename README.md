# Message Rewriter (Next.js + Gemini)

This app rewrites messages with better grammar and style presets:

- `Formal`
- `Casual`
- `GenZ` (with 0-10 intensity slider)

It uses a Next.js API route (`/api/rewrite`) to call Gemini server-side, so you can deploy only on Vercel without a separate backend host.

## 1) Setup

Create your environment file:

```bash
cp .env.example .env.local
```

Then put your Gemini key in `.env.local`:

```bash
GEMINI_API_KEY=your_api_key_here
```

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
  "style": "formal | casual | genz",
  "genzIntensity": 5,
  "variantCount": 3
}
```

Response body:

```json
{
  "variants": [
    { "text": "rewritten message", "notes": "short explanation" }
  ]
}
```

## 4) Deploy to Vercel

1. Push this `frontend` project to GitHub.
2. Import it into Vercel.
3. Add environment variable:
   - `GEMINI_API_KEY`
4. Deploy.
