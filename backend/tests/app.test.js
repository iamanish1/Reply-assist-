import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import { createApp } from '../src/app.js';
import { getEnv } from '../src/config/env.js';

test('GET /health returns ok', async () => {
  const env = getEnv({ CORS_ORIGINS: '' });
  const app = createApp({ env });

  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: 'ok' });
});

test('POST /api/reply requires a non-empty message', async () => {
  const env = getEnv({ CORS_ORIGINS: '' });
  const app = createApp({ env });

  const res = await request(app).post('/api/reply').send({});
  assert.equal(res.status, 400);
  assert.equal(res.body?.message, 'Message is required.');
});

test('POST /api/reply rate limits by IP', async () => {
  const env = getEnv({
    CORS_ORIGINS: '',
    RATE_LIMIT_MAX: 2,
    RATE_LIMIT_WINDOW_MS: 60_000
  });
  const app = createApp({ env });

  const agent = request(app);
  const ip = '1.2.3.4';

  const r1 = await agent.post('/api/reply').set('X-Forwarded-For', ip).send({});
  const r2 = await agent.post('/api/reply').set('X-Forwarded-For', ip).send({});
  const r3 = await agent.post('/api/reply').set('X-Forwarded-For', ip).send({});

  assert.equal(r1.status, 400);
  assert.equal(r2.status, 400);
  assert.equal(r3.status, 429);
  assert.equal(r3.body?.message, 'Too many requests. Please try again in a minute.');
});

test('POST /api/reply returns generic error on LLM failure', async () => {
  const env = getEnv({ CORS_ORIGINS: '', GROQ_API_KEY: '' });
  const app = createApp({ env });

  const res = await request(app)
    .post('/api/reply')
    .send({ message: 'Tum hamesha late reply karte ho' });

  assert.equal(res.status, 500);
  assert.equal(res.body?.message, 'Something went wrong. Please try again.');
});


