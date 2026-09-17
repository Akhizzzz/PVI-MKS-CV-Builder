export type AISectionType = 'PROFILE' | 'SKILL' | 'WORK_EXPERIENCE' | 'PROJECT' | 'EDUCATION' | 'CERTIFICATION';

export type AIResult =
  | { ok: true; output: string }
  | { ok: true; bullets: string[] }
  | { ok: false; message: string };

const GENERIC_FAILURE_MESSAGE = "We couldn't improve the wording right now. Your original text is safe. Please try again.";

/**
 * The only place in the frontend that knows the AI endpoint exists. Every
 * form calls this instead of talking to fetch/Groq directly. Never throws —
 * every failure (network, timeout, server error) collapses into the same
 * generic, non-technical message so CV content is never put at risk and no
 * internals (HTTP status, model name, stack trace) ever reach the UI.
 */
export async function enhanceCVContent(sectionType: AISectionType, data: Record<string, string>): Promise<AIResult> {
  try {
    const response = await fetch('/api/ai/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sectionType, data }),
      signal: AbortSignal.timeout(25_000),
    });

    const body = await response.json().catch(() => null);

    if (!response.ok || !body || body.ok !== true) {
      const message = typeof body?.message === 'string' ? body.message : GENERIC_FAILURE_MESSAGE;
      return { ok: false, message };
    }

    if (typeof body.result?.output === 'string') {
      return { ok: true, output: body.result.output };
    }
    if (Array.isArray(body.result?.bullets)) {
      return { ok: true, bullets: body.result.bullets };
    }
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  } catch {
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
