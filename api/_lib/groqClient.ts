import Groq from 'groq-sdk';

let client: Groq | null = null;

/** Lazily constructed so a missing GROQ_API_KEY only fails a request,
 * not the whole module (and never at import time / build time). */
export function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }
  if (!client) {
    client = new Groq({
      apiKey,
      // groq-sdk defaults to a 60s timeout with 2 automatic retries — its
      // own docs warn a slow request can then take far longer than that
      // before failing. Bounded tighter here (worst case ~20s: one 10s
      // attempt + one 10s retry) so a stuck request fails predictably,
      // well inside the frontend's 25s abort, instead of silently
      // stacking retries into a multi-minute wait (brief §29: no
      // uncontrolled retry loops).
      timeout: 10_000,
      maxRetries: 1,
    });
  }
  return client;
}

export function getGroqModel(): string {
  return process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';
}
