import { getApiBaseUrl } from '../config/apiBaseUrl';

const GENERIC_MSG = 'Something went wrong. Please try again.';
const NETWORK_MSG =
  'Can’t reach the server. Make sure the backend is running and set the backend URL in Settings.';

function withTimeout(timeoutMs) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, id };
}

function safeJson(value) {
  if (!value || typeof value !== 'object') return null;
  return value;
}

export async function fetchReplySuggestions({ message, context }) {
  const baseUrl = await getApiBaseUrl();
  const url = `${baseUrl}/api/reply`;

  const { controller, id } = withTimeout(6000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, context }),
      signal: controller.signal
    });

    const data = safeJson(await res.json().catch(() => null));

    if (!res.ok) {
      const msg =
        typeof data?.message === 'string' && data.message.trim()
          ? data.message
          : 'Something went wrong. Please try again.';
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }

    const replies = data?.replies;
    if (!Array.isArray(replies) || replies.some((r) => typeof r !== 'string')) {
      const err = new Error(GENERIC_MSG);
      err.code = 'BAD_RESPONSE';
      throw err;
    }

    return replies.slice(0, 3);
  } catch (e) {
    if (e?.name === 'AbortError') {
      throw new Error(GENERIC_MSG);
    }
    // If we got a HTTP status, it’s a server-side error (already has a safe message).
    if (typeof e?.status === 'number') throw e;
    // If we explicitly detected a bad response shape, keep it generic.
    if (e?.code === 'BAD_RESPONSE') throw new Error(GENERIC_MSG);
    // Otherwise, this is usually a network/connectivity issue.
    throw new Error(`${NETWORK_MSG}\nTried: ${baseUrl}`);
  } finally {
    clearTimeout(id);
  }
}


