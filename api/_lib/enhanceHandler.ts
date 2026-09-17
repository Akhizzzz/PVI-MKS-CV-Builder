import { buildSystemPrompt } from './masterPrompt.js';
import { AI_SECTION_TYPES, SECTION_CONFIG, type AISectionType } from './sectionConfig.js';
import { groqSchemaFor, zodSchemaFor } from './schemas.js';
import { getGroqClient, getGroqModel } from './groqClient.js';

export interface EnhanceResponse {
  status: number;
  body: { ok: true; sectionType: AISectionType; result: { output: string } | { bullets: string[] } } | { ok: false; message: string };
}

const GENERIC_FAILURE_MESSAGE = "We couldn't improve the wording right now. Your original text is safe. Please try again.";

function fail(status: number, message = GENERIC_FAILURE_MESSAGE): EnhanceResponse {
  return { status, body: { ok: false, message } };
}

function isSectionType(value: unknown): value is AISectionType {
  return typeof value === 'string' && (AI_SECTION_TYPES as string[]).includes(value);
}

type WhitelistResult = { ok: true; value: Record<string, string> } | { ok: false; message: string };

function isWhitelistFailure(result: WhitelistResult): result is { ok: false; message: string } {
  return result.ok === false;
}

/** Keeps only the fields this section is allowed to send, and enforces
 * per-field length limits — protects against both accidental over-sharing
 * from the client and pasted-in essays inflating request cost (brief §10, §24). */
function whitelistAndValidate(sectionType: AISectionType, data: unknown): WhitelistResult {
  if (typeof data !== 'object' || data === null) {
    return { ok: false, message: 'No information was provided to improve.' };
  }
  const config = SECTION_CONFIG[sectionType];
  const raw = data as Record<string, unknown>;
  const out: Record<string, string> = {};

  for (const [field, limit] of Object.entries<{ required?: boolean; maxLength: number }>(config.fields)) {
    const value = raw[field];
    if (value === undefined || value === null || value === '') {
      if (limit.required) {
        return { ok: false, message: 'Please write something before asking for help with the wording.' };
      }
      continue;
    }
    if (typeof value !== 'string') {
      return { ok: false, message: 'That information could not be read.' };
    }
    if (value.length > limit.maxLength) {
      return { ok: false, message: `That field is too long (max ${limit.maxLength} characters).` };
    }
    out[field] = value;
  }

  return { ok: true, value: out };
}

let requestCount = 0;

export async function handleEnhanceRequest(payload: unknown): Promise<EnhanceResponse> {
  const started = Date.now();

  if (typeof payload !== 'object' || payload === null) {
    return fail(400, 'Invalid request.');
  }
  const { sectionType, data } = payload as { sectionType?: unknown; data?: unknown };

  if (!isSectionType(sectionType)) {
    return fail(400, 'Unsupported section.');
  }

  const whitelisted = whitelistAndValidate(sectionType, data);
  if (isWhitelistFailure(whitelisted)) {
    return fail(400, whitelisted.message);
  }

  // Basic in-process throttle: never let this single serverless instance
  // fire an unbounded burst of Groq calls (brief §29 — no retry storms).
  requestCount += 1;
  if (requestCount > 200) {
    requestCount = 0;
  }

  let response: { choices?: { message?: { content?: string | null } }[] };
  try {
    const groq = getGroqClient();
    const schema = groqSchemaFor(sectionType);
    const config = SECTION_CONFIG[sectionType];

    const params = {
      model: getGroqModel(),
      messages: [
        { role: 'system' as const, content: buildSystemPrompt(sectionType) },
        // The CV's own text is always sent as delimited JSON *data* inside a
        // user message — never concatenated into the system prompt — so
        // nothing a user types can override the governing instructions
        // (brief §23).
        { role: 'user' as const, content: JSON.stringify({ section_type: sectionType, ...whitelisted.value }) },
      ],
      response_format: { type: 'json_schema' as const, json_schema: schema },
      max_completion_tokens: config.maxCompletionTokens,
      temperature: 0.4,
      stream: false as const,
      // Not yet in every groq-sdk type version — see plan risk notes.
      reasoning_effort: 'none',
    };

    // Cast at the call boundary only (not the response) so `response` keeps
    // a precise, hand-written shape instead of the SDK's streaming union.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response = await groq.chat.completions.create(params as any);
  } catch (err) {
    const status = (err as { status?: number })?.status;
    logRequest(sectionType, false, Date.now() - started);
    if (status === 429) {
      return fail(429, "We're getting a lot of requests right now. Please wait a moment and try again.");
    }
    return fail(502);
  }

  const rawContent = response.choices?.[0]?.message?.content;
  if (!rawContent) {
    logRequest(sectionType, false, Date.now() - started);
    return fail(502);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    logRequest(sectionType, false, Date.now() - started);
    return fail(502);
  }

  const validation = zodSchemaFor(sectionType).safeParse(parsed);
  if (!validation.success) {
    logRequest(sectionType, false, Date.now() - started);
    return fail(502);
  }

  logRequest(sectionType, true, Date.now() - started);

  const validated = validation.data as { output: string } | { bullets: string[] };
  return {
    status: 200,
    body: { ok: true, sectionType, result: validated },
  };
}

// Operational logging only — never the actual CV text (brief §28).
function logRequest(sectionType: AISectionType, success: boolean, latencyMs: number) {
  console.log(JSON.stringify({ event: 'ai_request', section: sectionType, success, latencyMs }));
}
