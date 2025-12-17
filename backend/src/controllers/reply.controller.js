import { buildReplyPrompt } from '../services/prompt.service.js';
import { createLLMService, AppError } from '../services/llm.service.js';
import { cleanReplies } from '../utils/responseCleaner.js';

function cleanShortString(value, maxLen = 40) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLen);
}

export function createReplyController({ env }) {
  const llm = createLLMService({ env });

  return async function replyController(req, res, next) {
    try {
      const body = req.body ?? {};
      const message = typeof body.message === 'string' ? body.message.trim() : '';
      const context = typeof body.context === 'object' && body.context ? body.context : {};

      if (!message) {
        throw new AppError({
          statusCode: 400,
          publicMessage: 'Message is required.',
          isPublic: true
        });
      }

      if (message.length > env.MAX_MESSAGE_CHARS) {
        throw new AppError({
          statusCode: 413,
          publicMessage: 'Message is too long.',
          isPublic: true
        });
      }

      const relationship = cleanShortString(context.relationship);
      const tone = cleanShortString(context.tone);

      const prompt = buildReplyPrompt({
        message,
        context: { relationship, tone }
      });

      const raw = await llm.generateRepliesText({ prompt });
      const replies = cleanReplies(raw, { tone });

      res.json({ replies });
    } catch (err) {
      next(err);
    }
  };
}


