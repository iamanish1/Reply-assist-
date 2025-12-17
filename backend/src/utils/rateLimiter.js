export function createRateLimiter({ windowMs, max }) {
  const buckets = new Map();

  function getClientIp(req) {
    // Prefer X-Forwarded-For if behind a proxy (Render/Railway/Fly).
    const xff = req.headers['x-forwarded-for'];
    if (typeof xff === 'string' && xff.length > 0) {
      return xff.split(',')[0].trim();
    }
    return req.ip || req.connection?.remoteAddress || 'unknown';
  }

  return function rateLimiter(req, res, next) {
    const ip = getClientIp(req);
    const now = Date.now();

    const entry = buckets.get(ip);
    if (!entry || now - entry.windowStart >= windowMs) {
      buckets.set(ip, { windowStart: now, count: 1 });
      return next();
    }

    if (entry.count >= max) {
      res
        .status(429)
        .json({ message: 'Too many requests. Please try again in a minute.' });
      return;
    }

    entry.count += 1;
    buckets.set(ip, entry);
    next();
  };
}


