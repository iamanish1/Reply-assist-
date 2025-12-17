# Reply Assistant Backend (V1)

Privacy-first, stateless Express backend for generating **3 short, ready-to-send replies** (not a chatbot).

## Requirements
- Node.js 18+

## Setup
1. Install deps:

```bash
cd backend
npm install
```

2. Create your env file:
- Create `backend/.env` with at least:
  - `GROQ_API_KEY=...`
  - Optional: `PORT=3001`, `GROQ_MODEL=llama-3.3-70b-versatile`, `LLM_TIMEOUT_MS=4000`, `MAX_MESSAGE_CHARS=800`

3. Run locally:

```bash
npm run dev
```

## Endpoints
### Health
- `GET /health` → `{ "status": "ok" }`

### Generate replies
- `POST /api/reply`

Request body:

```json
{
  "message": "Tum hamesha late reply karte ho",
  "context": { "relationship": "personal", "tone": "calm" }
}
```

Success response (no extra metadata):

```json
{
  "replies": [
    "Sorry yaar 😔 thoda busy tha, didn’t mean to ignore you.",
    "I get why you’re upset. I’ll reply faster.",
    "Sorry, that wasn’t intentional."
  ]
}
```

## Notes (privacy & safety)
- No message storage. No conversation history.
- No raw message logging.
- Rate-limited on `/api/reply`.

## Deploy
Works on Railway / Render / Fly.io.
- Set env vars (`PORT` optional, `GROQ_API_KEY` required).
- Start command: `npm start`

## Mobile app connection (Expo)
- **Android emulator** default base URL: `http://10.0.2.2:3001`
- **iOS simulator** default base URL: `http://localhost:3001`
- For production builds, set `EXPO_PUBLIC_API_BASE_URL` in the mobile app build environment.


