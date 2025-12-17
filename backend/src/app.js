import express from 'express';
import cors from 'cors';

import { getEnv } from './config/env.js';
import { createReplyRouter } from './routes/reply.route.js';

function isLocalOrigin(origin) {
  try {
    const url = new URL(origin);
    return url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1';
  } catch {
    return false;
  }
}

export function createApp(options = {}) {
  const env = options.env ?? getEnv();

  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));

  app.use(
    cors({
      origin(origin, cb) {
        // Allow non-browser clients (curl, server-to-server) with no Origin header.
        if (!origin) return cb(null, true);

        // If explicit allowlist provided, use it.
        if (env.CORS_ORIGINS.length > 0) {
          return cb(null, env.CORS_ORIGINS.includes(origin));
        }

        // Default: local-only (privacy-first dev setup)
        return cb(null, isLocalOrigin(origin));
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
      maxAge: 600
    })
  );

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/reply', createReplyRouter({ env }));

  app.use((_req, res) => {
    res.status(404).json({ message: 'Not found.' });
  });

  app.use((err, _req, res, _next) => {
    // Privacy-first: do not return stack traces or internal error details.
    const status = err?.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;

    if (err?.isPublic && typeof err.publicMessage === 'string') {
      res.status(status).json({ message: err.publicMessage });
      return;
    }

    const message =
      status === 429
        ? 'Too many requests. Please try again in a minute.'
        : 'Something went wrong. Please try again.';
    res.status(status).json({ message });
  });

  return app;
}

export default createApp();


