const GROQ_CHAT_COMPLETIONS_URL =
  'https://api.groq.com/openai/v1/chat/completions';

export class AppError extends Error {
  constructor({ statusCode = 500, publicMessage = '', isPublic = false } = {}) {
    super(publicMessage || 'Error');
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.publicMessage = publicMessage;
    this.isPublic = isPublic;
  }
}

function withTimeout(ms) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  return { controller, timeoutId };
}

async function groqChatCompletion({ apiKey, model, timeoutMs, prompt }) {
  const { controller, timeoutId } = withTimeout(timeoutMs);

  try {
    const res = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 420
      }),
      signal: controller.signal
    });

    if (!res.ok) {
      throw new AppError({
        statusCode: 502,
        publicMessage: 'Something went wrong. Please try again.',
        isPublic: false
      });
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      throw new AppError({
        statusCode: 502,
        publicMessage: 'Something went wrong. Please try again.',
        isPublic: false
      });
    }
    return content;
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new AppError({
        statusCode: 504,
        publicMessage: 'Something went wrong. Please try again.',
        isPublic: false
      });
    }
    if (err instanceof AppError) throw err;
    throw new AppError({
      statusCode: 502,
      publicMessage: 'Something went wrong. Please try again.',
      isPublic: false
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export function createLLMService({ env }) {
  return {
    async generateRepliesText({ prompt }) {
      if (!env.GROQ_API_KEY) {
        // Do not expose config details to clients.
        throw new AppError({
          statusCode: 500,
          publicMessage: 'Something went wrong. Please try again.',
          isPublic: false
        });
      }

      // Provider abstraction point: swap this function for another provider later.
      return groqChatCompletion({
        apiKey: env.GROQ_API_KEY,
        model: env.GROQ_MODEL,
        timeoutMs: env.LLM_TIMEOUT_MS,
        prompt
      });
    }
  };
}


