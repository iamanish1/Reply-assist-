import { createApp } from './app.js';
import { getEnv } from './config/env.js';

const env = getEnv();

const serverApp = createApp({ env });

serverApp.listen(env.PORT, env.HOST, () => {
  // Intentionally minimal log (no request content logging).
  console.log(`Reply Assistant backend listening on http://${env.HOST}:${env.PORT}`);
});


