import express from 'express';

import { createRateLimiter } from '../utils/rateLimiter.js';
import { createReplyController } from '../controllers/reply.controller.js';

export function createReplyRouter({ env }) {
  const router = express.Router();

  const rateLimiter = createRateLimiter({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX
  });

  const controller = createReplyController({ env });

  router.post('/', rateLimiter, controller);

  return router;
}


