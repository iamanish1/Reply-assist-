import dotenv from 'dotenv';

dotenv.config();

function parseIntEnv(value, fallback) {
  if (value === undefined || value === '') return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseListEnv(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function getEnv(overrides = {}) {
  const NODE_ENV = overrides.NODE_ENV ?? process.env.NODE_ENV ?? 'development';
  const isProd = NODE_ENV === 'production';

  const HOST = overrides.HOST ?? process.env.HOST ?? '0.0.0.0';
  const PORT = parseIntEnv(overrides.PORT ?? process.env.PORT, 3001);
  const GROQ_API_KEY = overrides.GROQ_API_KEY ?? process.env.GROQ_API_KEY ?? '';
  const GROQ_MODEL =
    overrides.GROQ_MODEL ??
    process.env.GROQ_MODEL ??
    'llama-3.3-70b-versatile';

  const LLM_TIMEOUT_MS = parseIntEnv(
    overrides.LLM_TIMEOUT_MS ?? process.env.LLM_TIMEOUT_MS,
    4000
  );

  const MAX_MESSAGE_CHARS = parseIntEnv(
    overrides.MAX_MESSAGE_CHARS ?? process.env.MAX_MESSAGE_CHARS,
    800
  );

  const RATE_LIMIT_WINDOW_MS = parseIntEnv(
    overrides.RATE_LIMIT_WINDOW_MS ?? process.env.RATE_LIMIT_WINDOW_MS,
    60_000
  );

  const RATE_LIMIT_MAX = parseIntEnv(
    overrides.RATE_LIMIT_MAX ?? process.env.RATE_LIMIT_MAX,
    10
  );

  const CORS_ORIGINS = parseListEnv(
    overrides.CORS_ORIGINS ?? process.env.CORS_ORIGINS
  );

  return {
    NODE_ENV,
    isProd,
    HOST,
    PORT,
    GROQ_API_KEY,
    GROQ_MODEL,
    LLM_TIMEOUT_MS,
    MAX_MESSAGE_CHARS,
    RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX,
    CORS_ORIGINS
  };
}


