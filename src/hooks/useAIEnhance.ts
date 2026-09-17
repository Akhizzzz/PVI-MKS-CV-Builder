import { useCallback, useRef, useState } from 'react';
import { enhanceCVContent, type AISectionType, type AIResult } from '../services/aiWritingService';
import { hasAcknowledgedAINotice, acknowledgeAINotice } from '../data/aiConsent';

export type AIEnhanceStatus = 'idle' | 'pending-consent' | 'loading' | 'error';

/**
 * One "make professional" action's loading/consent/error state. Kept
 * deliberately unaware of what the result *means* (a paragraph vs. a list
 * of bullets, undo behaviour) — that stays in each form, per the brief's
 * "don't overengineer this abstraction" guidance.
 */
export function useAIEnhance() {
  const [status, setStatus] = useState<AIEnhanceStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inFlight = useRef(false);
  const pendingRequest = useRef<{ sectionType: AISectionType; data: Record<string, string>; resolve: (r: AIResult | null) => void } | null>(null);

  const execute = useCallback(async (sectionType: AISectionType, data: Record<string, string>): Promise<AIResult> => {
    setStatus('loading');
    setErrorMessage(null);
    const result = await enhanceCVContent(sectionType, data);
    inFlight.current = false;
    if (result.ok) {
      setStatus('idle');
    } else {
      setStatus('error');
      setErrorMessage(result.message);
    }
    return result;
  }, []);

  const run = useCallback(
    (sectionType: AISectionType, data: Record<string, string>): Promise<AIResult | null> => {
      if (inFlight.current) {
        return Promise.resolve(null);
      }
      inFlight.current = true;

      if (!hasAcknowledgedAINotice()) {
        setStatus('pending-consent');
        return new Promise((resolve) => {
          pendingRequest.current = { sectionType, data, resolve };
        });
      }

      return execute(sectionType, data);
    },
    [execute],
  );

  const confirmConsent = useCallback(() => {
    acknowledgeAINotice();
    const pending = pendingRequest.current;
    pendingRequest.current = null;
    if (pending) {
      execute(pending.sectionType, pending.data).then(pending.resolve);
    }
  }, [execute]);

  const cancelConsent = useCallback(() => {
    const pending = pendingRequest.current;
    pendingRequest.current = null;
    inFlight.current = false;
    setStatus('idle');
    if (pending) pending.resolve(null);
  }, []);

  return { status, errorMessage, run, confirmConsent, cancelConsent };
}
